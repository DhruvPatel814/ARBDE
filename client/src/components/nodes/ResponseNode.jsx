import React from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowLeftCircle } from 'lucide-react';

export default function ResponseNode({ data }) {
  return (
    <div className="bg-white border border-purple-200 rounded-xl shadow-sm w-56 overflow-hidden group hover:border-purple-400 hover:shadow-md transition-all">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 rounded p-1.5 text-white">
            <ArrowLeftCircle size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Response</span>
            <span className="text-[10px] text-slate-400 font-medium">Response</span>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="in" className="w-2.5 h-2.5 bg-slate-300 border-none left-[-5px]" />
    </div>
  );
}
