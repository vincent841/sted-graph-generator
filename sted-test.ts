import { StedGraph } from 'sted-graph-type';

import { StedGraphAnalyer } from './sted-graph-analyzer';

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'B',
      type: 'vchp',
      inlets: [
        { name: 'cond', node: 'A', type: 'fluid' },
        { name: 'evap', node: 'A', type: 'fluid' },
        { name: 'evap', node: 'E', type: 'fluid' }
      ],
      outlets: [
        { name: 'cond', node: 'C', type: 'fluid' },
        { name: 'evap', node: 'E', type: 'fluid' }
      ]
    },
    {
      name: 'A',
      type: 'vchp',
      inlets: [
        {
          name: 'cond',
          node: '',
          type: 'fluid',
          data: {
            Y: { H2O: 0.99, N2O: 0.01 },
            m: 1.0,
            T: 333.0,
            p: 101200.0,
            q: 1.0,
            h: 1.0
          }
        },
        {
          name: 'evap',
          node: '',
          type: 'fluid',
          data: {
            Y: { H2O: 0.99, N2O: 0.01 },
            m: 1.0,
            T: 310.0,
            p: 101200.0,
            q: 1.0,
            h: 1.0
          }
        }
      ],
      outlets: [
        { name: 'cond', node: 'B', type: 'fluid' },
        { name: 'evap', node: 'B', type: 'fluid' }
      ],
      start: true
    },
    {
      name: 'C',
      type: 'vchp',
      inlets: [
        { name: 'cond', node: 'B', type: 'fluid' },
        { name: 'cond', node: 'D', type: 'fluid' },
        {
          name: 'evap',
          node: '',
          type: 'fluid',
          data: {
            Y: { H2O: 0.99, N2O: 0.01 },
            m: 1.0,
            T: 333.0,
            p: 101200.0,
            q: 1.0,
            h: 1.0
          }
        }
      ],
      outlets: [
        { name: 'cond', node: 'D', type: 'fluid' },
        { name: 'evap', node: 'D', type: 'fluid' }
      ]
    },
    {
      name: 'D',
      type: 'vchp',
      inlets: [
        { name: 'cond', node: 'C', type: 'fluid' },
        { name: 'evap', node: 'C', type: 'fluid' }
      ],
      outlets: [
        { name: 'cond', node: 'C', type: 'fluid' },
        { name: 'evap', node: '', type: 'fluid' }
      ]
    },
    {
      name: 'E',
      type: 'vchp',
      inlets: [
        {
          name: 'cond',
          node: '',
          type: 'fluid',
          data: {
            Y: { H2O: 0.99, N2O: 0.01 },
            m: 1.0,
            T: 333.0,
            p: 101200.0,
            q: 1.0,
            h: 1.0
          }
        },
        { name: 'evap', node: 'B', type: 'fluid' }
      ],
      outlets: [
        { name: 'cond', node: '', type: 'fluid' },
        { name: 'evap', node: 'B', type: 'fluid' }
      ]
    }
  ]
}

try {
  let stedGraphAnalyzer = new StedGraphAnalyer(exampleGraph)
  stedGraphAnalyzer.print()

  let generatedGraph = stedGraphAnalyzer.generateAnalyzableGraph()

  console.log(JSON.stringify(generatedGraph))
} catch (ex) {
  console.error('Exception: ', ex)
}
