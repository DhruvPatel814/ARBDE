import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Save, FolderOpen, Download, Trash2, X } from 'lucide-react';

const STORAGE_KEY = 'arbde_templates';

export default function TemplateManager() {
  const { nodes, edges, requestJson, loadTemplateData, loadCompanyTemplate, loadLoanTemplate } = useStore();
  
  const [templates, setTemplates] = useState([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  const handleSave = () => {
    const name = window.prompt("Enter template name:");
    if (!name || name.trim() === '') return;
    
    // Deep copy to prevent reference issues
    const newTemplate = {
      id: Date.now().toString(),
      name: name.trim(),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      request: requestJson
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  };

  const handleLoad = (template) => {
    if (template.isSample) {
      if (template.id === 'sample-company') loadCompanyTemplate();
      if (template.id === 'sample-loan') loadLoanTemplate();
    } else {
      loadTemplateData(template);
    }
    setShowLoadModal(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
  };

  const sampleTemplates = [
    { id: 'sample-company', name: 'Company Classification', isSample: true },
    { id: 'sample-loan', name: 'Loan Approval', isSample: true }
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-1 px-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded hover:bg-slate-50 hover:text-blue-600 focus:outline-none transition-colors shadow-sm"
          title="Save Rule"
        >
          <Save size={14} />
          <span>Save Rule</span>
        </button>
        <button
          onClick={() => setShowLoadModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded hover:bg-slate-50 hover:text-blue-600 focus:outline-none transition-colors shadow-sm"
          title="Load Rule"
        >
          <FolderOpen size={14} />
          <span>Load Rule</span>
        </button>
      </div>

      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col transform transition-all">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FolderOpen size={18} className="text-blue-500" />
                Saved Rules
              </h3>
              <button 
                onClick={() => setShowLoadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[65vh] p-4 bg-white">
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">Sample Rules</h4>
                <div className="space-y-2">
                  {sampleTemplates.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => handleLoad(t)}
                      className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all shadow-sm hover:shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Download size={16} />
                        </div>
                        <span className="font-medium text-sm text-slate-700 group-hover:text-blue-800">{t.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">My Saved Rules</h4>
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Save size={24} className="mx-auto mb-2 text-slate-300" />
                    <p>No saved rules yet.</p>
                    <p className="text-xs mt-1">Click "Save Rule" to store your current flow.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => handleLoad(t)}
                        className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all shadow-sm hover:shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FolderOpen size={16} />
                          </div>
                          <span className="font-medium text-sm text-slate-700 group-hover:text-blue-800">{t.name}</span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded bg-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 shadow-sm border border-transparent hover:border-red-100"
                          title="Delete Rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
