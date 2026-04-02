import React from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowLeftCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function ResponseNode({ data, id }) {
  const { updateNodeData } = useStore();
  const onChangeTitle = (e) => updateNodeData(id, { label: e.target.value });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-56 overflow-hidden group hover:border-slate-400 hover:shadow-md transition-all">
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
      <Handle type="target" position={Position.Left} id="in" className="w-2.5 h-2.5 bg-slate-300 border-none left-[-5px]" />
    </div>
  );
}
