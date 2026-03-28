import React from 'react';
import useStore from '../store/useStore';
import Editor from '@monaco-editor/react';
import { Play, Copy, Filter } from 'lucide-react';

export default function BottomPanel() {
  const { nodes, edges, requestJson, responseJson, setRequestJson, setResponseJson } = useStore();

  const handleRun = async () => {
    try {
      const apiUrl = import.meta.env.PROD ? '/evaluate' : 'http://localhost:3000/evaluate';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graph: { nodes, edges },
          data: JSON.parse(requestJson)
        }),
      });
      const result = await response.json();
      setResponseJson(JSON.stringify(result, null, 2));
    } catch (err) {
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  return (
    <div className="h-64 border-t border-slate-200 bg-white flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex h-full">
        {/* Request Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center h-10">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Request (json5)
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
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* Nodes/Graph info - mock for now, Zen has it but we just use two big panels for MVP */}
        
        {/* Response Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center h-10">
            <span className="text-sm font-semibold text-slate-700">Response</span>
            <span className="cursor-pointer text-slate-400 hover:text-slate-600">×</span>
          </div>
          <div className="flex-1 p-1 bg-white">
             <Editor
              height="100%"
              defaultLanguage="json"
              value={responseJson}
              theme="light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
