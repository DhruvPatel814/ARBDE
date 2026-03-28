import React from 'react';
import { Handle, Position } from 'reactflow';
import { Table, MoreVertical } from 'lucide-react';
import useStore from '../../store/useStore';

export default function DecisionTableNode({ data, id }) {
  const openTableModal = useStore(state => state.openTableModal);

  return (
    <div className="bg-white border border-blue-200 rounded-xl shadow-sm w-64 overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all">
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded p-1.5 text-white">
            <Table size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">{data.label || 'Decision table'}</span>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-32">Decision table</span>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-500 hover:bg-slate-100 p-1 rounded transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
      <div 
        className="px-4 py-2 bg-slate-50 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => openTableModal(id)}
      >
         <span className="text-xs text-blue-600 font-medium hover:underline">Edit Table</span>
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2.5 h-2.5 bg-slate-300 border-none left-[-5px]" />
      <Handle type="source" position={Position.Right} id="out" className="w-2.5 h-2.5 bg-slate-300 border-none right-[-5px]" />
    </div>
  );
}
