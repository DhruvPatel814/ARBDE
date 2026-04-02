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

  // Build Adjacency List including source handles
  const adj = {};
  edges.forEach(e => {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push({ target: e.target, handle: e.sourceHandle });
  });

  // State context that flows through the graph
  let stateCtx = JSON.parse(JSON.stringify(initialData));
  let logs = [];
  logs.push('[Request] Received: ' + JSON.stringify(stateCtx));

  // Traversal Queue
  const queue = [...(adj[requestNode.id] || [])];
  const processed = new Set();
  let hasReachedResponse = false;

  while (queue.length > 0) {
    const currentEdge = queue.shift();
    const currentId = currentEdge.target;
    
    // Allow revisiting nodes if needed for different branches? 
    // Usually no for DAGs, but let's keep processed set.
    if (processed.has(currentId)) continue;
    processed.add(currentId);

    const node = nodes.find(n => n.id === currentId);
    if (!node) continue;

    const label = node.data.label || node.type;
    
    if (node.type === 'response') {
      logs.push(`[Response] Flow reached end.`);
      hasReachedResponse = true;
      continue;
    }

    let nextEdges = adj[currentId] || [];

    try {
      if (node.type === 'decisionTable') {
        const output = await evaluateDecisionTable(node.data, stateCtx);
        Object.assign(stateCtx, output);
        logs.push(`[Decision Table Node - ${label}] evaluated rules`);
        
      } else if (node.type === 'expression') {
        const expr = node.data.expression || '""';
        const func = new Function('input', `return ${expr}`);
        const result = func(stateCtx);
        
        logs.push(`[Expression Node - ${label}] result = ${JSON.stringify(result)}`);
        if (result && typeof result === 'object' && !Array.isArray(result)) {
           Object.assign(stateCtx, result);
        } else if (result !== undefined) {
           const key = label.replace(/\s+/g, '_');
           stateCtx[key] = result;
        }

      } else if (node.type === 'function') {
        const body = node.data.functionBody || 'return {};';
        const func = new Function('input', body);
        const result = func(stateCtx);
        
        logs.push(`[Function Node - ${label}] executed`);
        if (result && typeof result === 'object' && !Array.isArray(result)) {
           Object.assign(stateCtx, result);
        } else if (result !== undefined) {
           const key = label.replace(/\s+/g, '_');
           stateCtx[key] = result;
        }

      } else if (node.type === 'decision') {
        const cond = node.data.condition || 'false';
        const func = new Function('input', `return ${cond}`);
        const isTrue = !!func(stateCtx);
        
        logs.push(`[Decision Node - ${label}] condition evaluated to ${isTrue}`);
        const expectedHandle = isTrue ? 'true' : 'false';
        nextEdges = nextEdges.filter(e => e.handle === expectedHandle);
      } else {
        logs.push(`[Unknown Node - ${label}] skipped`);
      }
    } catch (err) {
      logs.push(`[ERROR in ${label}] ${err.message}`);
    }

    nextEdges.forEach(e => {
      queue.push(e);
    });
  }

  if (!hasReachedResponse) {
    logs.push('[Warning] Flow did not reach a Response node.');
  }

  return { output: stateCtx, logs };
}

module.exports = {
  evaluateGraph
};
