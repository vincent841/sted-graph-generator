import { StedGraphAnalyer } from '../sted-graph-analyzer'
import { StedGraph } from '../sted-graph-type'

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'B',
      type: 'VCHP',
      inlets: [
        { name: 'InCond', srcNode: 'A', srcEdge: 'OutCond', type: 'fluid' },
        { name: 'InEvap', srcNode: 'A', srcEdge: 'OutEvap', type: 'fluid' }
      ],
      outlets: [
        { name: 'OutCond', dstNode: 'C', type: 'fluid', dstEdge: 'InStr2' },
        { name: 'OutEvap', dstNode: 'D', type: 'fluid', dstEdge: 'InEvap' }
      ]
    },
    {
      name: 'C',
      type: 'Mix',
      inlets: [
        { name: 'InStr1', srcNode: 'D', srcEdge: 'OutCond', type: 'fluid' },
        { name: 'InStr2', srcNode: 'B', srcEdge: 'OutCond', type: 'fluid' }
      ],
      outlets: [{ name: 'OutStr', dstNode: 'D', type: 'fluid', dstEdge: 'InCond' }]
    },
    {
      name: 'D',
      type: 'VCHP',
      inlets: [
        { name: 'InCond', srcNode: 'C', srcEdge: 'OutStr', type: 'fluid' },
        { name: 'InEvap', srcNode: 'B', srcEdge: 'OutEvap', type: 'fluid' }
      ],
      outlets: [
        { name: 'OutCond', dstNode: 'C', type: 'fluid', dstEdge: 'InStr1' },
        { name: 'OutEvap', dstNode: '', type: 'fluid', dstEdge: '' }
      ]
    },
    {
      name: 'A',
      type: 'VCHP',
      inlets: [
        {
          name: 'InCond',
          srcNode: '',
          srcEdge: '',
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
          name: 'InEvap',
          srcNode: '',
          srcEdge: '',
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
        { name: 'OutCond', dstNode: 'B', type: 'fluid', dstEdge: 'InCond' },
        { name: 'OutEvap', dstNode: 'B', type: 'fluid', dstEdge: 'InEvap' }
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
