import { StedGraphAnalyer } from './sted-graph-analyzer';
import { StedGraph } from './sted-graph-type';

var exampleGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'custom',
      inlets: [{ name: 'custin', node: '', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid' }],
      start: true
    },
    {
      name: 'B',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'A', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'C', type: 'fluid' }]
    },
    {
      name: 'C',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'B', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'D', type: 'fluid' }]
    },
    {
      name: 'D',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'C', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'E', type: 'fluid' }]
    },
    {
      name: 'E',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'D', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid' }]
    }
  ]
}

var resultGraph: StedGraph = {
  stedNodes: [
    {
      name: 'A',
      type: 'custom',
      inlets: [{ name: 'custin', node: '', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid' }],
      start: true
    },
    {
      name: 'B',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'A', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'C', type: 'fluid' }]
    },
    {
      name: 'C',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'B', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'D', type: 'fluid' }]
    },
    {
      name: 'D',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'C', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'DE', type: 'fluid' }]
    },
    {
      name: 'E',
      type: 'custom',
      inlets: [{ name: 'custin', node: 'DE', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'B', type: 'fluid' }]
    },
    {
      name: 'DE',
      type: 'cycle',
      inlets: [{ name: 'custin', node: 'D', type: 'fluid' }],
      outlets: [{ name: 'custout', node: 'E', type: 'fluid' }]
    }
  ]
}

try {
  let stedGraphAnalyzer = new StedGraphAnalyer(exampleGraph)
  stedGraphAnalyzer.print()

  console.log('generated graph: ', JSON.stringify(stedGraphAnalyzer.generateGraphWithCircles()))
} catch (ex) {
  console.error('Exception: ', ex)
}
