import React from 'react';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import BottomPanel from './components/BottomPanel';
import DecisionTableModal from './components/DecisionTableModal';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <GraphCanvas />
      </div>
      <BottomPanel />
      <DecisionTableModal />
    </div>
  );
}

export default App;
