export interface StedInOutLet {
  name: string
  node: string
  type: string
  data?: any
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
