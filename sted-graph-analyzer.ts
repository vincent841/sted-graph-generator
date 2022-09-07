import { alg, Graph } from 'graphlib'
import deepClone from 'lodash/cloneDeep'

import { StedGraph, StedNode } from './sted-graph-type'

export class StedGraphAnalyer {
  private stedGraph: StedGraph
  static recycleNodeName: string = 'Recycle'

  constructor(graphData: StedGraph) {
    this.stedGraph = graphData
  }

  print() {
    console.log(JSON.stringify(this.stedGraph))
  }

  generateGraph(stedNodeList: StedNode[]) {
    var generatedGraph = new Graph()
    stedNodeList.forEach(stedNode => {
      generatedGraph.setNode(stedNode.name)
      stedNode.outlets.forEach(out => generatedGraph.setEdge(stedNode.name, out.dstNode))
    })

    return generatedGraph
  }

  findCycles() {
    return alg.findCycles(this.generateGraph(this.stedGraph.stedNodes))
  }

  sortNodes(stedBaseGraph: StedGraph) {
    var genGraph = this.generateGraph(stedBaseGraph.stedNodes)
    return alg.topsort(genGraph)
  }

  lineUpTwoNodes(nodes: string[], refGraph: StedGraph) {
    let node0: StedNode = refGraph.stedNodes.find(node => node.name === nodes[0])
    let node1: StedNode = refGraph.stedNodes.find(node => node.name === nodes[1])

    return node0.outlets.find(outl => outl.dstNode === nodes[1]) ? [node0, node1] : [node1, node0]
  }

  getSortedGraph(cycles, graphData: StedGraph): any {
    // generate a Graph instance using STED nodes
    var generatedGraph = this.generateGraph(graphData.stedNodes)

    // remove cycled edges to make it acyclic
    cycles.forEach(cycle => {
      generatedGraph.removeEdge(cycle[0], cycle[1])
    })

    // check if the Graph is a acyclic and apply sorting to it.
    let sortedList = alg.isAcyclic(generatedGraph) ? alg.topsort(generatedGraph) : []

    // sort the STED graph based on Graph node sequence by sorting algorithm
    sortedList.forEach((element, sortedIndex) => {
      let originalIndex = graphData.stedNodes.findIndex(node => node.name == element)
      if (originalIndex > 0) {
        graphData.stedNodes.splice(sortedIndex, 0, graphData.stedNodes.splice(originalIndex, 1)[0])
      }
    })
  }

  generateAnalyzableGraph(): StedGraph {
    let cycles = this.findCycles()
    console.debug('[DEBUG] cycles: ', cycles)

    // clone input graph
    var newGraph = deepClone(this.stedGraph)

    // sort the graph
    this.getSortedGraph(cycles, newGraph)

    // insert recycle node between cycled nodes
    cycles.forEach(cycle => {
      // choose first two nodes as a cutting edge
      // TODO: need to check if there are only two nodes with a cycle?
      let [prevNode, nextNode] = this.lineUpTwoNodes([cycle[0], cycle[1]], newGraph)

      // create new node name(prevName_nextName)
      let cycleNodeName = prevNode.name + '_' + nextNode.name
      console.debug('[DEBUG] cycleNodeName: ', cycleNodeName)

      // TODO: chekc if two nodes have two cycles simultaneously..
      //  if so, we need to set up an inlet and an outlet based on both nodes(prevNode & nextNode)
      // append new cycle node to the exsiting graph
      newGraph.stedNodes.push({
        name: cycleNodeName,
        type: StedGraphAnalyer.recycleNodeName,
        inlets: [
          {
            name: 'InStr',
            type: prevNode.outlets.find(outlet => outlet.dstNode === nextNode.name)?.type,
            srcNode: prevNode.name,
            srcEdge: prevNode.outlets.find(outlet => outlet.dstNode === nextNode.name)?.name
          }
        ],
        outlets: [
          {
            name: 'OutStr',
            type: nextNode.inlets.find(inlet => inlet.srcNode === prevNode.name)?.type,
            dstNode: nextNode.name,
            dstEdge: nextNode.inlets.find(inlet => inlet.srcNode === prevNode.name)?.name
          }
        ]
      })

      // update the adjacent nodes for a new generated node
      prevNode.outlets.map(outl => {
        if (outl.dstNode === nextNode.name) {
          outl.dstNode = cycleNodeName
        }
      })
      nextNode.inlets.map(inl => {
        if (inl.srcNode === prevNode.name) {
          inl.srcNode = cycleNodeName
        }
      })
    })

    return newGraph
  }
}
