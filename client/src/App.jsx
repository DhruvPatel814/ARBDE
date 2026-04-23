import React from 'react';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import BottomPanel from './components/BottomPanel';
import DecisionTableEditor from './components/DecisionTableEditor';
import useStore from './store/useStore';
import { Network, Table, X } from 'lucide-react';
import TemplateManager from './components/TemplateManager';

function App() {
  const { openTabs, activeTab, setActiveTab, closeTab } = useStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-sm z-20">
        <h1 className="font-bold text-md tracking-wide flex items-center gap-2">
          <Network size={18} className="text-blue-400" />
          ARBDE – Visual Rule-Based Decision Engine
        </h1>
        <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700">
          <span className="text-purple-300">Input Data</span>
          <span className="text-slate-500">→</span>
          <span className="text-blue-400">Rule Engine Execution</span>
          <span className="text-slate-500">→</span>
          <span className="text-green-400">Decision Output</span>
        </div>
      </div>

      {/* Top Tab Bar */}
      <div className="flex bg-slate-100 border-b border-slate-200 h-10 px-2 items-end justify-between z-10">
        <div className="flex pt-1 flex-1">
          {openTabs.map(tab => {
          if (tab.id === 'graph') return null;
          const isActive = activeTab === tab.id;
          return (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border border-b-0 rounded-t-lg mx-1 cursor-pointer text-sm font-medium transition-colors select-none ${isActive ? 'bg-white border-slate-200 text-blue-600 shadow-[0_2px_0_0_white] z-10' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-200'}`}
              style={isActive ? { marginBottom: '-1px' } : {}}
            >
              {tab.id === 'graph' ? <Network size={14} /> : <Table size={14} />}
              {tab.title}
              {tab.id !== 'graph' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} 
                  className={`ml-1 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 ${isActive ? 'hover:bg-slate-100' : ''}`}
                >
                  <X size={12} strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}
        </div>
        <TemplateManager />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-0">
        {activeTab === 'graph' ? (
          <>
            <Sidebar />
            <GraphCanvas />
          </>
        ) : (
          <DecisionTableEditor tabId={activeTab} />
        )}
      </div>
      
      {/* Bottom Panel */}
      <BottomPanel />
    </div>
  );
}

export default App;
