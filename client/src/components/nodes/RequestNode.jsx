import React from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowRightCircle } from 'lucide-react';

export default function RequestNode({ data }) {
  return (
    <div className="bg-white border border-purple-200 rounded-xl shadow-sm w-56 overflow-hidden group hover:border-purple-400 hover:shadow-md transition-all">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 rounded p-1.5 text-white">
            <ArrowRightCircle size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Request</span>
            <span className="text-[10px] text-slate-400 font-medium">Request</span>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="w-2.5 h-2.5 bg-slate-300 border-none right-[-5px]" />
    </div>
  );
}
