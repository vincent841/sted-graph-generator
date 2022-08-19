import { alg, Graph } from 'graphlib';
import deepClone from 'lodash/cloneDeep';

import { StedGraph, StedNode } from './sted-graph-type';

export class StedGraphAnalyer {
  private stedGraph: StedGraph
  static specialNodeName: string = 'recycle'

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
      stedNode.outlets.forEach(out => generatedGraph.setEdge(stedNode.name, out.node))
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

    return node0.outlets.find(outl => outl.node === nodes[1]) ? [node0, node1] : [node1, node0]
  }

  getSortedGraph(cycles, graphData: StedGraph): any {
    var generatedGraph = this.generateGraph(graphData.stedNodes)

    cycles.forEach(cycle => {
      generatedGraph.removeEdge(cycle[0], cycle[1])
    })

    let sortedList = alg.isAcyclic(generatedGraph) ? alg.topsort(generatedGraph) : []

    // console.log('soretedList: ', sortedList)

    sortedList.forEach((element, sortedIndex) => {
      let originalIndex = graphData.stedNodes.findIndex(node => node.name == element)
      if (originalIndex > 0) {
        graphData.stedNodes.splice(sortedIndex, 0, graphData.stedNodes.splice(originalIndex, 1)[0])
      }
    })

    // console.log('sorted graphData: ', graphData)
  }

  generateAnalyzableGraph(): StedGraph {
    let cycles = this.findCycles()
    console.debug('[DEBUG] cycles: ', cycles)

    var newGraph = deepClone(this.stedGraph)

    this.getSortedGraph(cycles, newGraph)

    cycles.forEach(cycle => {
      // choose first two nodes as a cutting edge
      // TODO: need to check if there are only two nodes with a cycle?
      let [prevNode, nextNode] = this.lineUpTwoNodes([cycle[0], cycle[1]], newGraph)

      // create new node name
      let cycleNodeName = prevNode.name + '_' + nextNode.name
      console.debug('[DEBUG] cycleNodeName: ', cycleNodeName)

      // append new cycle node to the exsiting graph
      newGraph.stedNodes.push({
        name: cycleNodeName,
        type: StedGraphAnalyer.specialNodeName,
        inlets: [{ node: prevNode.name, type: prevNode.outlets.find(outlet => outlet.node === nextNode.name)?.type }],
        outlets: [{ node: nextNode.name, type: nextNode.inlets.find(inlet => inlet.node === prevNode.name)?.type }]
      })

      // update the adjacent nodes for a new generated node
      prevNode.outlets.map(outl => {
        if (outl.node === nextNode.name) {
          outl.node = cycleNodeName
        }
      })
      nextNode.inlets.map(inl => {
        if (inl.node === prevNode.name) {
          inl.node = cycleNodeName
        }
      })
    })

    return newGraph
  }
}
