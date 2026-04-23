import React from 'react';
import { ArrowLeftCircle, ArrowRightCircle, Calculator, FileQuestion, FunctionSquare, Network, Table, Trash2, FileText } from 'lucide-react';
import useStore from '../store/useStore';

const nodeTypes = [
  { type: 'request', label: 'Request', icon: ArrowRightCircle, desc: 'Provides input context', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { type: 'response', label: 'Response', icon: ArrowLeftCircle, desc: 'Outputs the context', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { type: 'decisionTable', label: 'Decision table', icon: Table, desc: 'Rules spreadsheet', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { type: 'function', label: 'Function', icon: FunctionSquare, desc: 'Javascript lambda', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { type: 'expression', label: 'Expression', icon: Calculator, desc: 'Mapping utility', color: 'text-sky-500', bg: 'bg-sky-100', border: 'border-sky-200' },
  { type: 'decision', label: 'Decision', icon: FileQuestion, desc: 'Conditional branching', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
];

export default function Sidebar() {
  const { clearFlow, nodes, addNode, edges, setRequestJson, loadCompanyTemplate, loadLoanTemplate } = useStore();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleClearFlow = () => {
    if (confirm('Are you sure you want to clear the flow? All unsaved data will be lost.')) {
      clearFlow();
    }
  };

  const handleLoadSample = (sample) => {
    if (!confirm('This will overwrite the current flow. Continue?')) return;
    
    clearFlow();
    if (sample === 'company') {
      const startId = `request-${Date.now()}`;
      const decisionId = `decision-${Date.now()}`;
      const responseId = `response-${Date.now()}`;
      
      const sampleNodes = [
        { id: startId, type: 'request', position: { x: 50, y: 150 }, data: { label: 'Request' } },
        { id: decisionId, type: 'decision', position: { x: 300, y: 150 }, data: { label: 'Check US Corp', condition: 'input.company.country === "US"' } },
        { id: responseId, type: 'response', position: { x: 600, y: 150 }, data: { label: 'Response' } }
      ];
      
      // We will need to set state via store
      // But we can just use addNode multiple times, or we need an action to set entire graph
      // Let's create an action in store later or just rely on state.nodes mutation?
      // Actually, since we're using Zustand, we should probably add a setGraph action.
      // But for MVP, let's keep it simple.
    }
  };

  return (
    <div className="w-80 h-full bg-slate-50 border-r border-[#e2e8f0] flex flex-col items-center py-4 flex-shrink-0 z-10 shadow-sm relative">
      <div className="w-full flex justify-between items-center px-4 mb-4 pb-2 border-b border-gray-200">
         <h2 className="text-sm font-semibold text-slate-800">Components</h2>
         <button onClick={handleClearFlow} title="Clear Flow" className="cursor-pointer text-slate-400 hover:text-red-500 px-2 py-1 rounded transition-colors flex items-center gap-1 text-xs">
           <Trash2 size={14} /> Clear
         </button>
      </div>
      <div className="flex flex-col gap-3 w-full px-4 overflow-y-auto pb-4 flex-1">
        {nodeTypes.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              title={item.desc}
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
