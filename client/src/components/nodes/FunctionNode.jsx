import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { FunctionSquare, Trash2, Copy } from 'lucide-react';
import useStore from '../../store/useStore';

export default function FunctionNode({ data, id }) {
  const { deleteNode, duplicateNode, updateNodeData, executingNodeId, nodeResults, nodeErrors, visitedNodes } = useStore();
  
  const isExecuting = executingNodeId === id;
  const isError = nodeErrors[id];
  const hasResult = nodeResults[id] !== undefined;
  const isVisited = visitedNodes && visitedNodes.includes(id);
  const isSkipped = visitedNodes && visitedNodes.length > 0 && !isVisited && !isExecuting;

  let borderClass = 'border-yellow-200 hover:border-yellow-400';
  if (isExecuting) borderClass = 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-105 z-10';
  else if (isError) borderClass = 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  
  const opacityClass = isSkipped ? 'opacity-40 grayscale' : 'opacity-100';
  
  const onChangeTitle = (e) => updateNodeData(id, { label: e.target.value });
  const onChangeBody = (e) => updateNodeData(id, { functionBody: e.target.value });

  return (
    <div 
      title="Executes custom logic"
      className={`bg-white border rounded-xl shadow-sm w-64 group hover:shadow-md transition-all flex flex-col ${borderClass} ${opacityClass}`}
    >
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-50 relative">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="bg-yellow-500 rounded p-1 text-white flex-shrink-0">
            <FunctionSquare size={14} strokeWidth={2.5} />
          </div>
          <input 
            className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-yellow-200 rounded px-1 w-full"
            value={data.label || 'Function'}
            onChange={onChangeTitle}
          />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => duplicateNode(id)} className="text-slate-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50" title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={() => deleteNode(id)} className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="p-3 bg-slate-50 rounded-b-xl flex flex-col gap-2">
         <span className="text-xs font-semibold text-slate-500">Function Body</span>
         <textarea
           className="w-full h-20 text-xs font-mono p-1.5 border border-slate-200 rounded focus:outline-none focus:border-yellow-400 resize-none"
           placeholder='return input.age > 18;'
           value={data.functionBody || ''}
           onChange={onChangeBody}
         />
         {hasResult && (
           <div className={`mt-2 p-2 rounded text-xs break-words font-mono ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
             Result: {typeof nodeResults[id] === 'object' ? JSON.stringify(nodeResults[id]) : String(nodeResults[id])}
           </div>
         )}
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 bg-slate-300 border-none left-[-4px]" />
      <Handle type="source" position={Position.Right} id="out" className="w-2 h-2 bg-slate-300 border-none right-[-4px]" />
    </div>
  );
}
