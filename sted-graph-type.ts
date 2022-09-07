export interface StedInlet {
  // wire name
  name: string
  // source node name
  // node type
  type: string
  // source node name
  srcNode: string
  // source edge name
  srcEdge: string
  // wire object data
  data?: any
}

export interface StedOutlet {
  // wire name
  name: string
  // node type
  type: string
  // destination node name
  dstNode: string
  // destination edge name
  dstEdge: string
  // wire object data
  data?: any
}

export interface StedNode {
  // node name
  name: string
  // node type
  type: string
  // node properties
  params?: any
  // node inlet list
  inlets: StedInlet[]
  // node outlet list
  outlets: StedOutlet[]
}

export interface StedGraph {
  stedNodes: StedNode[]
}
