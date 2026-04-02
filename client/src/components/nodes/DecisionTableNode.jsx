import React from 'react';
import { Handle, Position } from 'reactflow';
import { Table, Trash2, Copy } from 'lucide-react';
import useStore from '../../store/useStore';

export default function DecisionTableNode({ data, id }) {
  const { deleteNode, duplicateNode, updateNodeData, openTableTab } = useStore();
  
  const onChangeTitle = (e) => updateNodeData(id, { label: e.target.value });

  return (
    <div className="bg-white border border-blue-200 rounded-xl shadow-sm w-64 group hover:border-blue-400 hover:shadow-md transition-all flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-50 relative">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="bg-blue-500 rounded p-1 text-white flex-shrink-0">
            <Table size={14} strokeWidth={2.5} />
          </div>
          <input 
            className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-200 rounded px-1 w-full"
            value={data.label || 'Decision table'}
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
      <div 
        className="px-4 py-2 bg-slate-50 cursor-pointer hover:bg-blue-50 transition-colors rounded-b-xl"
        onClick={() => openTableTab(id)}
      >
         <span className="text-xs text-blue-600 font-medium hover:underline">Edit Table</span>
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 bg-slate-300 border-none left-[-4px]" />
      <Handle type="source" position={Position.Right} id="out" className="w-2 h-2 bg-slate-300 border-none right-[-4px]" />
    </div>
  );
}
