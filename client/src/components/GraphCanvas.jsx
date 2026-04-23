import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store/useStore';
import RequestNode from './nodes/RequestNode';
import ResponseNode from './nodes/ResponseNode';
import DecisionTableNode from './nodes/DecisionTableNode';
import ExpressionNode from './nodes/ExpressionNode';
import FunctionNode from './nodes/FunctionNode';
import DecisionNode from './nodes/DecisionNode';

const nodeTypes = {
  request: RequestNode,
  response: ResponseNode,
  decisionTable: DecisionTableNode,
  expression: ExpressionNode,
  function: FunctionNode,
  decision: DecisionNode,
};

function Graph() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, visitedEdges } = useStore();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );
  
  const isValidConnection = useCallback((connection) => {
    // strict check for visual only
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (!sourceNode || !targetNode || connection.source === connection.target) return false;
    if (sourceNode.type === 'response' || targetNode.type === 'request') return false;
    return true;
  }, [nodes]);

  const handleConnect = useCallback((connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (sourceNode?.type === 'response' || targetNode?.type === 'request') {
      setErrorMsg('Invalid Connection: Response cannot be a source, Request cannot be a target.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setErrorMsg('');
    onConnect(connection);
  }, [nodes, onConnect]);

  const renderedEdges = edges.map((e) => {
    const isVisited = visitedEdges?.includes(e.id);
    return {
      ...e,
      style: {
        ...e.style,
        stroke: isVisited ? '#22c55e' : '#cbd5e1', // Green for visited, light gray for skipped
        strokeWidth: isVisited ? 3 : 1.5,
      },
      animated: isVisited,
    };
  });

  return (
    <div className="flex-1 h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
      >
        <Background color="#ccc" gap={20} variant="dots" />
        <Controls />
      </ReactFlow>
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg transition-opacity z-50 text-sm font-semibold">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <Graph />
    </ReactFlowProvider>
  );
}
