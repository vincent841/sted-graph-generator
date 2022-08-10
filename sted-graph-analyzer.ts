import { alg, Graph } from 'graphlib';
import deepClone from 'lodash/cloneDeep';

import { StedGraph } from './sted-graph-type';

export class StedGraphAnalyer {
  private stedGraph: StedGraph

  constructor(graphData: StedGraph) {
    this.stedGraph = graphData
  }

  print() {
    console.log(JSON.stringify(this.stedGraph))
  }

  findCycles() {
    var graph = new Graph()
    this.stedGraph.stedNodes.forEach(stedNode => {
      graph.setNode(stedNode.name)
      stedNode.outlets.forEach(out => graph.setEdge(stedNode.name, out.node))
    })

    return alg.findCycles(graph)
  }

  generateGraphWithCircles(): StedGraph {
    let cycles = this.findCycles()
    var newGraph = deepClone(this.stedGraph)

    console.debug('[DEBUG] cycles: ', cycles)

    cycles.forEach(cycle => {
      // choose first two nodes as a cutting edge
      // TODO: need to check if there are only two nodes with a circle?
      let backNode =
        newGraph.stedNodes.find(node => node.name === cycle[0] && node.outlets.find(outl => outl.node === cycle[1])) ||
        newGraph.stedNodes.find(node => node.name === cycle[1] && node.outlets.find(outl => outl.node === cycle[0]))
      let frontNode =
        newGraph.stedNodes.find(node => node.name === cycle[0] && node.inlets.find(inl => inl.node === cycle[1])) ||
        newGraph.stedNodes.find(node => node.name === cycle[1] && node.inlets.find(inl => inl.node === cycle[0]))

      // create new node name
      let cycleNodeName = backNode.name + frontNode.name
      console.debug('[DEBUG] cycleNodeName: ', cycleNodeName)

      // append new circle node to the exsiting graph
      newGraph.stedNodes.push({
        name: cycleNodeName,
        type: 'cycle',
        inlets: [{ node: backNode.name, type: backNode.outlets.find(outlet => outlet.node === frontNode.name)?.type }],
        outlets: [{ node: frontNode.name, type: frontNode.inlets.find(inlet => inlet.node === backNode.name)?.type }]
      })

      // update the inlet and outlet of both side-nodes by new generated node
      backNode.outlets.map(outl => {
        if (outl.node === frontNode.name) {
          outl.node = cycleNodeName
        }
      })
      frontNode.inlets.map(inl => {
        if (inl.node === backNode.name) {
          inl.node = cycleNodeName
        }
      })
    })

    console.debug('[DEBUG] final generated graph: \n', newGraph)

    return newGraph
  }
}
