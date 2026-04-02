import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, Trash2, Save } from 'lucide-react';

export default function DecisionTableEditor({ tabId }) {
  const { nodes, updateNodeData } = useStore();
  
  // Extract nodeId from tabId (format: table-nodeId)
  const nodeId = tabId.replace('table-', '');
  const node = nodes.find(n => n.id === nodeId);
  
  const [rules, setRules] = useState([]);
  
  useEffect(() => {
    if (node && node.data.rules) {
      setRules(node.data.rules);
    } else {
      setRules([{ condition: '', output: {} }]);
    }
  }, [node]);

  if (!node) {
    return <div className="flex-1 p-8 text-center text-slate-500">Node not found</div>;
  }

  const handleAddRow = () => {
    setRules([...rules, { condition: '', output: {} }]);
  };

  const handleRemoveRow = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const handleChangeCondition = (index, value) => {
    const newRules = [...rules];
    newRules[index].condition = value;
    setRules(newRules);
  };

  const handleChangeOutput = (index, value) => {
    const newRules = [...rules];
    try {
      newRules[index].output = JSON.parse(value);
    } catch {
      newRules[index].outputStr = value; // keep invalid string for editing
    }
    setRules(newRules);
  };

  const handleSave = () => {
    updateNodeData(nodeId, {
      ...node.data,
      rules: rules.map(r => ({
        condition: r.condition,
        output: r.outputStr ? (function(){
          try { return JSON.parse(r.outputStr); } catch { return r.output; }
        })() : r.output
      }))
    });
    // Can show a toast or alert here but user prefers silent save or standard visual cue
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden p-6 gap-4">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Decision Table: {node.data.label}</h2>
          <p className="text-sm text-slate-500 mt-1">Define conditions and their corresponding outputs.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 w-16 text-center">#</th>
              <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 border-l">Condition (JS expr)</th>
              <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 border-l">Output (JSON)</th>
              <th className="p-3 font-semibold text-slate-700 border-b border-slate-200 border-l w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 border-b border-slate-200 text-center font-mono text-xs text-slate-500">{idx + 1}</td>
                <td className="p-0 border-b border-slate-200 border-l">
                  <input
                    type="text"
                    className="w-full h-full p-3 bg-transparent font-mono text-sm focus:outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400"
                    placeholder="input.company.country === 'US'"
                    value={rule.condition}
                    onChange={(e) => handleChangeCondition(idx, e.target.value)}
                  />
                </td>
                <td className="p-0 border-b border-slate-200 border-l">
                  <input
                    type="text"
                    className="w-full h-full p-3 bg-transparent font-mono text-sm focus:outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400"
                    placeholder='{"category": "High"}'
                    value={rule.outputStr !== undefined ? rule.outputStr : JSON.stringify(rule.output || {})}
                    onChange={(e) => handleChangeOutput(idx, e.target.value)}
                  />
                </td>
                <td className="p-3 border-b border-slate-200 border-l text-center">
                  <button onClick={() => handleRemoveRow(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Delete Row">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2">
        <button 
          onClick={handleAddRow}
          className="text-blue-600 hover:bg-blue-50 border border-blue-200 px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>
    </div>
  );
}
