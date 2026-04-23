import React, { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import Editor from '@monaco-editor/react';
import { Play, Filter, AlignLeft } from 'lucide-react';
import { evaluateGraphFrontend } from '../utils/frontendEvaluator';

export default function BottomPanel() {
  const { nodes, edges, requestJson, responseJson, setRequestJson, setResponseJson, logs, setLogs, clearExecutionState } = useStore();
  const debounceTimeout = useRef(null);

  const handleRun = async (isAutoRun = false) => {
    try {
      clearExecutionState();
      const initialData = JSON.parse(requestJson);
      setLogs(['Execution started...']);
      
      const result = await evaluateGraphFrontend({ nodes, edges }, initialData, { isAutoRun });
      
      setResponseJson(JSON.stringify(result.output || result, null, 2));
    } catch (err) {
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
      setLogs(prev => [...prev, `[Exception] ${err.message}`]);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (nodes.length > 0 && requestJson.trim() !== '') {
        handleRun(true);
      }
    }, 600);
    return () => clearTimeout(debounceTimeout.current);
  }, [nodes, edges, requestJson]);

  return (
    <div className="h-64 border-t border-slate-200 bg-white flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex h-full">
        {/* Request Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center h-10">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Input Data
              <Filter size={14} className="text-slate-400" />
            </span>
            <button
              onClick={handleRun}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded flex items-center gap-1 transition-colors"
            >
              <Play size={12} fill="currentColor" /> Run
            </button>
          </div>
          <div className="flex-1 p-1">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={requestJson}
              onChange={(value) => setRequestJson(value)}
              theme="light"
              options={{ minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, fontSize: 13, fontFamily: "'JetBrains Mono', 'Courier New', monospace", wordWrap: 'on' }}
            />
          </div>
        </div>

        {/* Logs Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center h-10">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AlignLeft size={14} className="text-slate-400" /> Logs
            </span>
          </div>
          <div className="flex-1 p-3 bg-[#1e1e1e] text-green-400 font-mono text-[11px] overflow-y-auto w-full leading-5">
             {logs && logs.length > 0 ? logs.map((log, i) => (
                <div key={i}>{log}</div>
             )) : (
                <div className="text-slate-500 italic">No execution logs yet. Run the flow to see output.</div>
             )}
          </div>
        </div>
        
        {/* Response Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center h-10">
            <span className="text-sm font-semibold text-slate-700">Decision Output</span>
          </div>
          <div className="flex-1 p-1 bg-white">
             <Editor
              height="100%"
              defaultLanguage="json"
              value={responseJson}
              theme="light"
              options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, fontSize: 13, fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
