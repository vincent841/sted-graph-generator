import { alg, Graph } from 'graphlib';
import deepClone from 'lodash/cloneDeep';

import { StedGraph, StedNode } from './sted-graph-type';

export class StedGraphAnalyer {
  private stedGraph: StedGraph

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
    console.log('genGraph: ', genGraph)
    return alg.topsort(genGraph)
  }

  confirmPrevNextNode(nodes: string[], refGraph: StedGraph) {
    let node0: StedNode = refGraph.stedNodes.find(node => node.name === nodes[0])
    let node1: StedNode = refGraph.stedNodes.find(node => node.name === nodes[1])

    return node0.outlets.find(outl => outl.node === nodes[1]) ? [node0, node1] : [node1, node0]
  }

  generateGraphWithCircles(): StedGraph {
    let cycles = this.findCycles()
    var newGraph = deepClone(this.stedGraph)

    console.debug('[DEBUG] cycles: ', cycles)

    cycles.forEach(cycle => {
      // choose first two nodes as a cutting edge
      // TODO: need to check if there are only two nodes with a circle?
      let [prevNode, nextNode] = this.confirmPrevNextNode([cycle[0], cycle[1]], newGraph)

      // create new node name
      let cycleNodeName = prevNode.name + '_' + nextNode.name
      console.debug('[DEBUG] cycleNodeName: ', cycleNodeName)

      // append new circle node to the exsiting graph
      newGraph.stedNodes.push({
        name: cycleNodeName,
        type: 'cycle',
        inlets: [{ node: prevNode.name, type: prevNode.outlets.find(outlet => outlet.node === nextNode.name)?.type }],
        outlets: [{ node: nextNode.name, type: nextNode.inlets.find(inlet => inlet.node === prevNode.name)?.type }]
      })

      // update the inlet and outlet of both side-nodes by new generated node
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

      console.log(
        'updated newGraph: ',
        newGraph.stedNodes.find(node => node.name === 'C')
      )
    })

    console.debug('[DEBUG] final generated graph: \n', newGraph)

    return newGraph
  }
}
