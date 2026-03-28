import React from 'react';
import { ArrowLeftCircle, ArrowRightCircle, Calculator, FileQuestion, FunctionSquare, Network, Table } from 'lucide-react';

const nodeTypes = [
  { type: 'request', label: 'Request', icon: ArrowRightCircle, desc: 'Provides input context', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { type: 'response', label: 'Response', icon: ArrowLeftCircle, desc: 'Outputs the context', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { type: 'decisionTable', label: 'Decision table', icon: Table, desc: 'Rules spreadsheet', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { type: 'function', label: 'Function', icon: FunctionSquare, desc: 'Javascript lambda', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
  { type: 'expression', label: 'Expression', icon: Calculator, desc: 'Mapping utility', color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { type: 'switch', label: 'Switch', icon: Network, desc: 'Conditional branching', color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { type: 'decision', label: 'Decision', icon: FileQuestion, desc: 'External decisions', color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200' },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 h-full bg-white border-r border-[#e2e8f0] flex flex-col items-center py-4 flex-shrink-0 z-10 shadow-sm relative">
      <div className="w-full flex justify-between items-center px-4 mb-4 pb-2 border-b border-gray-100">
         <h2 className="text-sm font-semibold text-slate-800">Components</h2>
         <span className="cursor-pointer text-slate-400 hover:text-slate-600 text-lg">×</span>
      </div>
      <div className="flex flex-col gap-3 w-full px-4 overflow-y-auto pb-6">
        {nodeTypes.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              className="flex flex-row items-center gap-4 border border-slate-200 rounded-lg p-3 bg-white shadow-sm cursor-grab hover:shadow-md hover:border-blue-300 transition-all group"
              onDragStart={(event) => onDragStart(event, item.type)}
              draggable
            >
              <div className={`p-2 rounded-md ${item.bg} ${item.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                <span className="text-xs text-slate-400">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
