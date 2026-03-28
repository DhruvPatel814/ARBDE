const { Parser } = require('expr-eval');

const parser = new Parser();

async function evaluateDecisionTable(nodeData, context) {
  const rules = nodeData.rules || [];
  let mergedOutput = {};

  for (const rule of rules) {
    try {
      if (!rule.condition) continue;
      // Evaluate condition expressions like: company.turnover > 100000
      const expr = parser.parse(rule.condition);
      const isMatch = expr.evaluate(context);
      
      if (isMatch) {
         // Deep merge or Object.assign the output
         if (rule.output && typeof rule.output === 'object') {
           mergedOutput = { ...mergedOutput, ...rule.output };
         }
      }
    } catch (err) {
      console.warn('Failed to evaluate condition:', rule.condition, err.message);
    }
  }
  return mergedOutput;
}

async function evaluateGraph(graph, initialData) {
  const { nodes = [], edges = [] } = graph;

  const requestNode = nodes.find(n => n.type === 'request');
  if (!requestNode) {
    throw new Error('Graph must contain a Request node.');
  }

  // Build Adjacency List
  const adj = {};
  edges.forEach(e => {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  });

  // State context that flows through the graph
  let stateCtx = JSON.parse(JSON.stringify(initialData));

  // Traversal Queue (Simple BFS)
  const queue = [...(adj[requestNode.id] || [])];
  const processed = new Set();
  let hasReachedResponse = false;

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (processed.has(currentId)) continue;

    const node = nodes.find(n => n.id === currentId);
    if (!node) continue;

    // Evaluate node based on type
    if (node.type === 'decisionTable') {
      const output = await evaluateDecisionTable(node.data, stateCtx);
      // Merge output into the main context
      Object.assign(stateCtx, output);
    }

    processed.add(currentId);

    if (node.type === 'response') {
      hasReachedResponse = true;
      continue;
    }

    if (adj[currentId]) {
      queue.push(...adj[currentId]);
    }
  }

  if (!hasReachedResponse) {
    throw new Error('Graph execution did not reach a Response node.');
  }

  return stateCtx;
}

module.exports = {
  evaluateGraph
};
