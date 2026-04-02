import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Calculator, Trash2, Copy } from 'lucide-react';
import useStore from '../../store/useStore';

export default function ExpressionNode({ data, id }) {
  const { deleteNode, duplicateNode, updateNodeData } = useStore();
  const titleRef = useRef(null);

  const onChangeTitle = (e) => {
    updateNodeData(id, { label: e.target.value });
  };

  const onChangeExpr = (e) => {
    updateNodeData(id, { expression: e.target.value });
  };

  return (
    <div className="bg-white border border-sky-200 rounded-xl shadow-sm w-64 group hover:border-sky-400 hover:shadow-md transition-all flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-50 relative">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="bg-sky-500 rounded p-1 text-white flex-shrink-0">
            <Calculator size={14} strokeWidth={2.5} />
          </div>
          <input 
            className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-sky-200 rounded px-1 w-full"
            value={data.label || 'Expression'}
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
         <span className="text-xs font-semibold text-slate-500">Expression</span>
         <input
           className="w-full text-xs font-mono p-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-400"
           placeholder='input.score > 50 ? "Pass" : "Fail"'
           value={data.expression || ''}
           onChange={onChangeExpr}
         />
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 bg-slate-300 border-none left-[-4px]" />
      <Handle type="source" position={Position.Right} id="out" className="w-2 h-2 bg-slate-300 border-none right-[-4px]" />
    </div>
  );
}
