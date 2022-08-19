import { StedGraphAnalyer } from './sted-graph-analyzer';
import { StedGraph } from './sted-graph-type';

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'custom',
      inlets: [{ name: 'custin', node: '', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'B',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'A', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'C', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'C',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'B', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'D', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'D',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'C', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'E', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'E',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'D', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid', wire: 'custin' }]
    }
  ]
}

var resultGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'custom',
      inlets: [{ name: 'custin', node: '', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'B',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'A', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'C', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'C',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'B', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'D', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'D',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'C', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'DE', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'E',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'DE', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid', wire: 'custin' }]
    },
    {
      name: 'DE',
      type: 'recycle',
      inlets: [{ name: 'custin', node: 'D', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'E', type: 'fluid', wire: 'custin' }]
    }
  ]
}

try {
  let stedGraphAnalyzer = new StedGraphAnalyer(exampleGraph)
  stedGraphAnalyzer.print()

  console.log('generated graph: ', JSON.stringify(stedGraphAnalyzer.generateAnalyzableGraph()))
} catch (ex) {
  console.error('Exception: ', ex)
}
