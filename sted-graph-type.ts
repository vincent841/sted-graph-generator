export interface StedInlet {
  // wire name
  name: string
  // source node name
  node: string
  // node type
  type: string
  // wire object data
  data?: any
}

export interface StedOutlet {
  // wire name
  name: string
  // destination node name
  node: string
  // node type
  type: string
  // destination wire name
  wire: string
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
