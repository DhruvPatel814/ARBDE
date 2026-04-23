import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, getConnectedEdges } from 'reactflow';

const initialNodes = [
  {
    id: 'request-1',
    type: 'request',
    position: { x: 50, y: 150 },
    data: { label: 'Request' },
  },
  {
    id: 'response-1',
    type: 'response',
    position: { x: 600, y: 150 },
    data: { label: 'Response' },
  },
];

const initialEdges = [];

const useStore = create(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      requestJson: '{\n  "company": {\n    "turnover": 10000000,\n    "type": "LLC",\n    "country": "US"\n  }\n}',
      responseJson: '',
      logs: [],
      // Execution Tracing State
      executingNodeId: null,
      nodeResults: {},
      nodeErrors: {},
      visitedNodes: [],
      visitedEdges: [],

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      addNode: (node) => {
        set({
          nodes: [...get().nodes, node],
        });
      },
      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data = { ...node.data, ...data };
            }
            return node;
          }),
        });
      },
      deleteNode: (nodeId) => {
        set((state) => {
          const nodeToDelete = state.nodes.find(n => n.id === nodeId);
          if (!nodeToDelete) return state;
          
          const remainingNodes = state.nodes.filter((n) => n.id !== nodeId);
          const remainingEdges = state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );
          
          return {
            nodes: remainingNodes,
            edges: remainingEdges,
          };
        });
      },
      duplicateNode: (nodeId) => {
        set((state) => {
          const nodeToDuplicate = state.nodes.find(n => n.id === nodeId);
          if (!nodeToDuplicate) return state;
          
          const newNode = {
            ...nodeToDuplicate,
            id: `${nodeToDuplicate.type}-${Date.now()}`,
            position: {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50,
            },
            selected: false,
          };
          
          return {
            nodes: [...state.nodes, newNode],
          };
        });
      },
      clearFlow: () => {
        set({
          nodes: initialNodes,
          edges: initialEdges,
          requestJson: '{\n  "company": {\n    "turnover": 10000000,\n    "type": "LLC",\n    "country": "US"\n  }\n}',
          responseJson: '',
          logs: [],
          executingNodeId: null,
          nodeResults: {},
          nodeErrors: {},
          visitedNodes: [],
          visitedEdges: [],
        });
      },
      // Tab management is replacing Modal
      activeTab: 'graph',
      openTabs: [{ id: 'graph', title: 'Graph' }],
      
      openTableTab: (nodeId) => {
        set((state) => {
          const node = state.nodes.find(n => n.id === nodeId);
          if (!node) return state;
          
          const newTabId = `table-${nodeId}`;
          const tabExists = state.openTabs.some(t => t.id === newTabId);
          
          return {
            openTabs: tabExists 
               ? state.openTabs 
               : [...state.openTabs, { id: newTabId, title: `Table: ${node.data.label || 'Decision table'}`, nodeId }],
            activeTab: newTabId
          };
        });
      },
      closeTab: (tabId) => {
        set((state) => {
          const newTabs = state.openTabs.filter(t => t.id !== tabId);
          return {
            openTabs: newTabs,
            activeTab: state.activeTab === tabId ? 'graph' : state.activeTab
          };
        });
      },
      setActiveTab: (tabId) => set({ activeTab: tabId }),
      
      setRequestJson: (val) => set({ requestJson: val }),
      setResponseJson: (val) => set({ responseJson: val }),
      setLogs: (val) => set({ logs: val }),
      
      // Execution Trace Actions
      setExecutingNodeId: (id) => set({ executingNodeId: id }),
      setNodeResult: (id, result) => set((state) => ({
        nodeResults: { ...state.nodeResults, [id]: result }
      })),
      setNodeError: (id, error) => set((state) => ({
        nodeErrors: { ...state.nodeErrors, [id]: error }
      })),
      addVisitedNode: (id) => set((state) => ({ visitedNodes: [...state.visitedNodes, id] })),
      addVisitedEdge: (id) => set((state) => ({ visitedEdges: [...state.visitedEdges, id] })),
      clearExecutionState: () => set({
        executingNodeId: null,
        nodeResults: {},
        nodeErrors: {},
        visitedNodes: [],
        visitedEdges: [],
        logs: [],
        responseJson: ''
      }),

      loadCompanyTemplate: () => {
        set({
          nodes: [
            { id: 'request-1', type: 'request', position: { x: 50, y: 150 }, data: { label: 'Request' } },
            { id: 'decision-1', type: 'decision', position: { x: 250, y: 150 }, data: { label: 'Check Country', condition: 'input.company.country === "US"' } },
            { id: 'expression-1', type: 'expression', position: { x: 500, y: 50 }, data: { label: 'US Category', expression: 'input.company.turnover > 1000000 ? "High" : "Low"' } },
            { id: 'expression-2', type: 'expression', position: { x: 500, y: 250 }, data: { label: 'Other Category', expression: '"N/A"' } },
            { id: 'response-1', type: 'response', position: { x: 750, y: 150 }, data: { label: 'Response' } }
          ],
          edges: [
            { id: 'e-req-dec', source: 'request-1', target: 'decision-1' },
            { id: 'e-dec-exp1', source: 'decision-1', target: 'expression-1', sourceHandle: 'true' },
            { id: 'e-dec-exp2', source: 'decision-1', target: 'expression-2', sourceHandle: 'false' },
            { id: 'e-exp1-res', source: 'expression-1', target: 'response-1' },
            { id: 'e-exp2-res', source: 'expression-2', target: 'response-1' }
          ],
          requestJson: '{\n  "company": {\n    "turnover": 5000000,\n    "type": "LLC",\n    "country": "US"\n  }\n}',
          responseJson: '',
          logs: [],
          activeTab: 'graph',
          openTabs: [{ id: 'graph', title: 'Graph' }]
        });
      },
      loadLoanTemplate: () => {
        set({
          nodes: [
            { id: 'request-1', type: 'request', position: { x: 50, y: 150 }, data: { label: 'Request' } },
            { id: 'decision-1', type: 'decision', position: { x: 300, y: 150 }, data: { label: 'High Income & Credit', condition: 'input.loan.income >= 50000 && input.creditScore >= 700' } },
            { id: 'decision-2', type: 'decision', position: { x: 600, y: 250 }, data: { label: 'Medium Income/Credit', condition: 'input.loan.income >= 30000 && input.creditScore >= 600' } },
            { id: 'expression-approve', type: 'expression', position: { x: 600, y: 50 }, data: { label: 'Approve', expression: '{ status: "Approved" }' } },
            { id: 'expression-review', type: 'expression', position: { x: 900, y: 150 }, data: { label: 'Review', expression: '{ status: "Review" }' } },
            { id: 'expression-reject', type: 'expression', position: { x: 900, y: 350 }, data: { label: 'Reject', expression: '{ status: "Rejected" }' } },
            { id: 'response-1', type: 'response', position: { x: 1200, y: 150 }, data: { label: 'Response' } }
          ],
          edges: [
            { id: 'e-req-dec1', source: 'request-1', target: 'decision-1' },
            { id: 'e-dec1-app', source: 'decision-1', target: 'expression-approve', sourceHandle: 'true' },
            { id: 'e-dec1-dec2', source: 'decision-1', target: 'decision-2', sourceHandle: 'false' },
            { id: 'e-dec2-rev', source: 'decision-2', target: 'expression-review', sourceHandle: 'true' },
            { id: 'e-dec2-rej', source: 'decision-2', target: 'expression-reject', sourceHandle: 'false' },
            { id: 'e-app-res', source: 'expression-approve', target: 'response-1' },
            { id: 'e-rev-res', source: 'expression-review', target: 'response-1' },
            { id: 'e-rej-res', source: 'expression-reject', target: 'response-1' }
          ],
          requestJson: '{\n  "loan": {\n    "amount": 75000,\n    "income": 60000\n  },\n  "creditScore": 720,\n  "existingLoans": 1\n}',
          responseJson: '',
          logs: [],
          activeTab: 'graph',
          openTabs: [{ id: 'graph', title: 'Graph' }],
          visitedNodes: [],
          visitedEdges: [],
          nodeResults: {},
          nodeErrors: {}
        });
      },
      loadTemplateData: (data) => {
        set({
          nodes: data.nodes || [],
          edges: data.edges || [],
          requestJson: data.request || '',
          responseJson: '',
          logs: [],
          activeTab: 'graph',
          openTabs: [{ id: 'graph', title: 'Graph' }]
        });
      }
    }),
    {
      name: 'arbde_flow',
      partialize: (state) => ({ 
        nodes: state.nodes, 
        edges: state.edges, 
        requestJson: state.requestJson 
      }),
    }
  )
);

export default useStore;
