import React from 'react';
import { Handle, Position } from 'reactflow';
import { FileQuestion, Trash2, Copy } from 'lucide-react';
import useStore from '../../store/useStore';

export default function DecisionNode({ data, id }) {
  const { deleteNode, duplicateNode, updateNodeData } = useStore();
  
  const onChangeTitle = (e) => updateNodeData(id, { label: e.target.value });
  const onChangeCond = (e) => updateNodeData(id, { condition: e.target.value });

  return (
    <div className="bg-white border border-green-200 rounded-xl shadow-sm w-64 group hover:border-green-400 hover:shadow-md transition-all flex flex-col pt-1">
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-50 relative">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="bg-green-500 rounded p-1 text-white flex-shrink-0">
            <FileQuestion size={14} strokeWidth={2.5} />
          </div>
          <input 
            className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-green-200 rounded px-1 w-full"
            value={data.label || 'Decision'}
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
         <span className="text-xs font-semibold text-slate-500">Condition</span>
         <input
           className="w-full text-xs font-mono p-1.5 border border-slate-200 rounded focus:outline-none focus:border-green-400"
           placeholder='input.isEligible === true'
           value={data.condition || ''}
           onChange={onChangeCond}
         />
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 bg-slate-300 border-none left-[-4px]" />
      
      {/* Two output handles - True and False */}
      <Handle type="source" position={Position.Right} id="true" className="w-2 h-2 bg-green-500 border-none right-[-4px] top-[30%]" />
      <span className="absolute right-2 top-[24%] text-[10px] text-green-600 font-bold">T</span>
      
      <Handle type="source" position={Position.Right} id="false" className="w-2 h-2 bg-red-400 border-none right-[-4px] top-[70%]" />
      <span className="absolute right-2 top-[64%] text-[10px] text-red-500 font-bold">F</span>
    </div>
  );
}
