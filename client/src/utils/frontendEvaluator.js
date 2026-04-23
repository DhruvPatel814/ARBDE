import useStore from '../store/useStore';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function evaluateGraphFrontend(graph, initialData, options = {}) {
  const { isAutoRun = false } = options;
  const store = useStore.getState();
  const { setExecutingNodeId, setNodeResult, setNodeError, setLogs, addVisitedNode, addVisitedEdge } = store;
  
  const { nodes = [], edges = [] } = graph;
  const requestNode = nodes.find(n => n.type === 'request');
  
  if (!requestNode) {
    throw new Error('Graph must contain a Request node.');
  }

  const adj = {};
  edges.forEach(e => {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push({ target: e.target, handle: e.sourceHandle, id: e.id });
  });

  let stateCtx = JSON.parse(JSON.stringify(initialData));
  let logs = [];
  let summary = [];
  
  const addLog = (msg) => {
    logs.push(msg);
    setLogs([...logs]);
  };

  addLog('[Request] Received: ' + JSON.stringify(stateCtx));
  summary.push('Execution Summary:');
  summary.push(`- Input received: ${JSON.stringify(stateCtx)}`);

  const queue = [...(adj[requestNode.id] || [])];
  const processed = new Set();
  let hasReachedResponse = false;
  
  // Delay wrapper for visualization
  const delayMs = isAutoRun ? 0 : 300;

  // Mark request node visually
  setExecutingNodeId(requestNode.id);
  setNodeResult(requestNode.id, stateCtx);
  addVisitedNode(requestNode.id);
  if (delayMs > 0) await sleep(delayMs);
  setExecutingNodeId(null);

  while (queue.length > 0) {
    const currentEdge = queue.shift();
    const currentId = currentEdge.target;
    addVisitedEdge(currentEdge.id);
    
    if (processed.has(currentId)) continue;
    processed.add(currentId);
    addVisitedNode(currentId);

    const node = nodes.find(n => n.id === currentId);
    if (!node) continue;

    const label = node.data.label || node.type;
    
    setExecutingNodeId(currentId);
    if (delayMs > 0) await sleep(delayMs);

    if (node.type === 'response') {
      addLog(`[Response] Flow reached end.`);
      summary.push(`- Final Output: ${JSON.stringify(stateCtx)}`);
      setNodeResult(currentId, stateCtx);
      hasReachedResponse = true;
      setExecutingNodeId(null);
      continue;
    }

    let nextEdges = adj[currentId] || [];

    try {
      if (node.type === 'decisionTable') {
        const rules = node.data.rules || [];
        let mergedOutput = {};
        for (const rule of rules) {
          if (!rule.condition) continue;
          // Evaluate condition securely in standard JS context
          const func = new Function('input', `return ${rule.condition}`);
          const isMatch = !!func(stateCtx);
          
          if (isMatch && rule.output && typeof rule.output === 'object') {
            mergedOutput = { ...mergedOutput, ...rule.output };
          }
        }
        Object.assign(stateCtx, mergedOutput);
        addLog(`[Decision Table Node - ${label}] evaluated rules`);
        summary.push(`- Node "${label}" (Decision Table): ${JSON.stringify(mergedOutput)}`);
        setNodeResult(currentId, mergedOutput);
        
      } else if (node.type === 'expression') {
        const expr = node.data.expression || '""';
        const func = new Function('input', `return ${expr}`);
        const result = func(stateCtx);
        
        addLog(`[Expression Node - ${label}] result = ${JSON.stringify(result)}`);
        summary.push(`- Node "${label}" (Expression): ${JSON.stringify(result)}`);
        setNodeResult(currentId, result);

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
        
        addLog(`[Function Node - ${label}] executed`);
        summary.push(`- Node "${label}" (Function): ${JSON.stringify(result)}`);
        setNodeResult(currentId, result);

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
        
        addLog(`[Decision Node - ${label}] condition evaluated to ${isTrue}`);
        summary.push(`- Node "${label}" (Decision): ${isTrue ? 'TRUE' : 'FALSE'}`);
        setNodeResult(currentId, isTrue);

        const expectedHandle = isTrue ? 'true' : 'false';
        nextEdges = nextEdges.filter(e => e.handle === expectedHandle);
      } else {
        addLog(`[Unknown Node - ${label}] skipped`);
        summary.push(`- Node "${label}" (Unknown): skipped`);
      }
    } catch (err) {
      addLog(`[ERROR in ${label}] ${err.message}`);
      summary.push(`- Node "${label}": ERROR - ${err.message}`);
      setNodeError(currentId, true);
      setNodeResult(currentId, `Error: ${err.message}`);
      // Stop path propagation on error
      nextEdges = [];
    }

    setExecutingNodeId(null);

    nextEdges.forEach(e => {
      queue.push(e);
    });
  }

  if (!hasReachedResponse) {
    addLog('[Warning] Flow did not reach a Response node.');
    summary.push('- Warning: Flow did not reach a Response node.');
  }

  summary.push('------------------------');
  
  // Combine logs with execution summary
  const finalLogs = [...logs, '', ...summary];
  setLogs(finalLogs);

  return { output: stateCtx, logs: finalLogs };
}
