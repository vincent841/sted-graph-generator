import { StedGraphAnalyer } from '../sted-graph-analyzer'
import { StedGraph } from '../sted-graph-type'

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'B',
      type: 'VCHP',
      inlets: [
        { name: 'cond', node: 'A', type: 'fluid' },
        { name: 'evap', node: 'A', type: 'fluid' }
      ],
      outlets: [
        { name: 'cond', node: 'C', type: 'fluid', wire: 'cond' },
        { name: 'evap', node: 'E', type: 'fluid', wire: 'evap' }
      ]
    },
    {
      name: 'C',
      type: 'Mix',
      inlets: [
        { name: 'src1', node: 'D', type: 'fluid' },
        { name: 'src2', node: 'B', type: 'fluid' }
      ],
      outlets: [{ name: 'out', node: 'D', type: 'fluid', wire: 'cond' }]
    },
    {
      name: 'D',
      type: 'VCHP',
      inlets: [
        { name: 'cond', node: 'C', type: 'fluid' },
        { name: 'evap', node: 'B', type: 'fluid' }
      ],
      outlets: [
        { name: 'cond', node: 'C', type: 'fluid', wire: 'src1' },
        { name: 'evap', node: '', type: 'fluid', wire: '' }
      ]
    },
    {
      name: 'A',
      type: 'VCHP',
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
        { name: 'cond', node: 'B', type: 'fluid', wire: 'cond' },
        { name: 'evap', node: 'B', type: 'fluid', wire: 'evap' }
      ]
    }
  ]
}

describe('sted-graph-analyzer', function () {
  describe('#no exception, no error()', function () {
    it('should run without any exception or error', async () => {
      try {
        let stedGraphAnalyzer = new StedGraphAnalyer(exampleGraph)
        console.log('input grpah: ')
        stedGraphAnalyzer.print()
        console.log('generated graph: ')
        console.log(JSON.stringify(stedGraphAnalyzer.generateAnalyzableGraph()))
      } catch (ex) {
        console.error('Exception: ', ex)
      }
    })
  })
})
