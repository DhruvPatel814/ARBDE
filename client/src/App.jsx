import React from 'react';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import BottomPanel from './components/BottomPanel';
import DecisionTableEditor from './components/DecisionTableEditor';
import useStore from './store/useStore';
import { Network, Table, X } from 'lucide-react';

function App() {
  const { openTabs, activeTab, setActiveTab, closeTab } = useStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Tab Bar */}
      <div className="flex bg-slate-100 border-b border-slate-200 h-10 px-2 items-end">
        {openTabs.map(tab => {
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
