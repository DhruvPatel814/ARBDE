import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { X, Plus, Trash2 } from 'lucide-react';

export default function DecisionTableModal() {
  const { isTableModalOpen, closeTableModal, focusTableId, nodes, updateNodeData } = useStore();
  const [rules, setRules] = useState([]);
  
  const node = nodes.find(n => n.id === focusTableId);

  useEffect(() => {
    if (isTableModalOpen && node) {
      setRules(node.data.rules || [{ condition: '', outputKey: '', outputValue: '' }]);
    }
  }, [isTableModalOpen, node]);

  if (!isTableModalOpen || !node) return null;

  const handleSave = () => {
    // Transform flat rules to the evaluator expected format
    const formattedRules = rules.map(r => ({
      condition: r.condition,
      output: { [r.outputKey]: r.outputValue }
    }));
    updateNodeData(focusTableId, { rules: formattedRules });
    closeTableModal();
  };

  const addRule = () => {
    setRules([...rules, { condition: '', outputKey: '', outputValue: '' }]);
  };

  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const deleteRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  // Convert the existing rules structure back to flat for editing if they were previously saved
  const viewRules = rules.map(r => {
    if (r.output && !r.outputKey) {
       const key = Object.keys(r.output)[0] || '';
       return { condition: r.condition, outputKey: key, outputValue: r.output[key] || '' };
    }
    return r;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[80vh] flex flex-col font-sans">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            Configure Decision Table <span className="text-sm font-normal text-slate-400">({node.data.label || 'Decision table'})</span>
          </h2>
          <button onClick={closeTableModal} className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
           <div className="bg-white border text-sm border-slate-200 rounded-lg overflow-hidden shadow-sm">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-100 border-b border-slate-200">
                   <th className="p-3 font-semibold text-slate-600 w-[50%]">Condition (e.g. company.turnover {'>'} 1000)</th>
                   <th className="p-3 font-semibold text-slate-600 w-[20%]">Output Key</th>
                   <th className="p-3 font-semibold text-slate-600 w-[20%]">Value</th>
                   <th className="p-3 font-semibold text-slate-600 w-[10%] text-center">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {viewRules.map((rule, idx) => (
                   <tr key={idx} className="hover:bg-slate-50">
                     <td className="p-2">
                       <input 
                         type="text" 
                         value={rule.condition}
                         onChange={(e) => updateRule(idx, 'condition', e.target.value)}
                         placeholder="company.country == 'US'"
                         className="w-full p-2 border border-slate-200 rounded focus:border-blue-400 outline-none focus:ring-2 ring-blue-100 font-mono text-xs"
                       />
                     </td>
                     <td className="p-2">
                       <input 
                         type="text" 
                         value={rule.outputKey}
                         onChange={(e) => updateRule(idx, 'outputKey', e.target.value)}
                         placeholder="isEligible"
                         className="w-full p-2 border border-slate-200 rounded focus:border-blue-400 outline-none focus:ring-2 ring-blue-100 font-mono text-xs"
                       />
                     </td>
                     <td className="p-2">
                       <input 
                         type="text" 
                         value={rule.outputValue}
                         onChange={(e) => updateRule(idx, 'outputValue', e.target.value)}
                         placeholder="true"
                         className="w-full p-2 border border-slate-200 rounded focus:border-blue-400 outline-none focus:ring-2 ring-blue-100 font-mono text-xs"
                       />
                     </td>
                     <td className="p-2 text-center">
                       <button onClick={() => deleteRule(idx)} className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50">
                         <Trash2 size={16} />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           <button onClick={addRule} className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
             <Plus size={16} /> Add Rule
           </button>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-white rounded-b-xl">
          <button onClick={closeTableModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded shadow-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm transition-colors">
            Save rules
          </button>
        </div>
      </div>
    </div>
  );
}
