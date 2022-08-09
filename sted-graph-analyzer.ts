import { alg, Graph } from 'graphlib';
import deepClone from 'lodash/cloneDeep';

export interface StedInOutLet {
  node: string
  type: string
}

export interface StedNode {
  name: string
  type: string
  inlets: StedInOutLet[]
  outlets: StedInOutLet[]
  start?: boolean
}

export interface StedGraph {
  stedNodes: StedNode[]
}

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
      let firstNode =
        newGraph.stedNodes.find(node => node.name === cycle[0] && node.outlets.find(outl => outl.node === cycle[1])) ||
        newGraph.stedNodes.find(node => node.name === cycle[1] && node.outlets.find(outl => outl.node === cycle[0]))
      let secondNode =
        newGraph.stedNodes.find(node => node.name === cycle[0] && node.inlets.find(inl => inl.node === cycle[1])) ||
        newGraph.stedNodes.find(node => node.name === cycle[1] && node.inlets.find(inl => inl.node === cycle[0]))

      // create new node name
      let cycleNodeName = firstNode.name + secondNode.name
      console.debug('[DEBUG] cycleNodeName: ', cycleNodeName)

      // append new circle node to the exsiting graph
      newGraph.stedNodes.push({
        name: cycleNodeName,
        type: 'cycle',
        inlets: [
          { node: firstNode.name, type: firstNode.outlets.find(outlet => outlet.node === secondNode.name)?.type }
        ],
        outlets: [{ node: secondNode.name, type: secondNode.inlets.find(inlet => inlet.node === firstNode.name)?.type }]
      })

      // update the inlet and outlet of both side-nodes by new generated node
      firstNode.outlets.map(outl => {
        if (outl.node === secondNode.name) {
          outl.node = cycleNodeName
        }
      })
      secondNode.inlets.map(inl => {
        if (inl.node === firstNode.name) {
          inl.node = cycleNodeName
        }
      })
    })

    console.debug('[DEBUG] final generated graph: \n', newGraph)

    return newGraph
  }
}
