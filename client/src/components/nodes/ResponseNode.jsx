import React from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowLeftCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function ResponseNode({ data, id }) {
  const { updateNodeData, executingNodeId, nodeResults, nodeErrors, visitedNodes } = useStore();
  
  const isExecuting = executingNodeId === id;
  const isError = nodeErrors[id];
  const hasResult = nodeResults[id] !== undefined;
  const isVisited = visitedNodes && visitedNodes.includes(id);
  const isSkipped = visitedNodes && visitedNodes.length > 0 && !isVisited && !isExecuting;

  let borderClass = 'border-slate-200 hover:border-slate-400';
  if (isExecuting) borderClass = 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-105 z-10';
  else if (isError) borderClass = 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  
  const opacityClass = isSkipped ? 'opacity-40 grayscale' : 'opacity-100';
  
  const onChangeTitle = (e) => updateNodeData(id, { label: e.target.value });

  return (
    <div 
      title="Final output"
      className={`bg-white border rounded-xl shadow-sm w-56 flex flex-col group hover:shadow-md transition-all ${borderClass} ${opacityClass}`}
    >
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="bg-slate-600 rounded p-1 text-white flex-shrink-0">
            <ArrowLeftCircle size={14} strokeWidth={2.5} />
          </div>
          <input 
            className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-slate-300 rounded px-1 w-full"
            value={data.label || 'Response'}
            onChange={onChangeTitle}
          />
        </div>
      </div>
      {hasResult && (
         <div className="px-3 pb-2 pt-1">
           <div className={`p-2 rounded text-xs break-words font-mono ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
             Result: {typeof nodeResults[id] === 'object' ? JSON.stringify(nodeResults[id]) : String(nodeResults[id])}
           </div>
         </div>
      )}
      <Handle type="target" position={Position.Left} id="in" className="w-2.5 h-2.5 bg-slate-300 border-none left-[-5px]" />
    </div>
  );
}
