import { assert } from 'console';
import isEqual from 'lodash/isEqual';

import { StedGraph, StedGraphAnalyer } from './sted-graph-analyzer';

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'vchp',
      inlets: [{ node: '', type: 'fluid' }],
      outlets: [{ node: 'B', type: 'fluid' }],
      start: true
    },
    {
      name: 'B',
      type: 'vchp',
      inlets: [{ node: 'A', type: 'fluid' }],
      outlets: [{ node: 'C', type: 'fluid' }]
    },
    {
      name: 'C',
      type: 'vchp',
      inlets: [{ node: 'B', type: 'fluid' }],
      outlets: [{ node: 'D', type: 'fluid' }]
    },
    {
      name: 'D',
      type: 'vchp',
      inlets: [{ node: 'C', type: 'fluid' }],
      outlets: [{ node: 'E', type: 'fluid' }]
    },
    {
      name: 'E',
      type: 'vchp',
      inlets: [{ node: 'D', type: 'fluid' }],
      outlets: [{ node: 'B', type: 'fluid' }]
    }
  ]
}

var resultGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'vchp',
      inlets: [{ node: '', type: 'fluid' }],
      outlets: [{ node: 'B', type: 'fluid' }],
      start: true
    },
    {
      name: 'B',
      type: 'vchp',
      inlets: [{ node: 'A', type: 'fluid' }],
      outlets: [{ node: 'C', type: 'fluid' }]
    },
    {
      name: 'C',
      type: 'vchp',
      inlets: [{ node: 'B', type: 'fluid' }],
      outlets: [{ node: 'D', type: 'fluid' }]
    },
    {
      name: 'D',
      type: 'vchp',
      inlets: [{ node: 'C', type: 'fluid' }],
      outlets: [{ node: 'DE', type: 'fluid' }]
    },
    {
      name: 'E',
      type: 'vchp',
      inlets: [{ node: 'DE', type: 'fluid' }],
      outlets: [{ node: 'B', type: 'fluid' }]
    },
    {
      name: 'DE',
      type: 'cycle',
      inlets: [{ node: 'D', type: 'fluid' }],
      outlets: [{ node: 'E', type: 'fluid' }]
    }
  ]
}

try {
  let stedGraphAnalyzer = new StedGraphAnalyer(exampleGraph)
  stedGraphAnalyzer.print()

  let generatedGraph = stedGraphAnalyzer.generateGraphWithCircles()

  assert(isEqual(resultGraph, generatedGraph))

  console.log(JSON.stringify(generatedGraph))
} catch (ex) {
  console.error('Exception: ', ex)
}
