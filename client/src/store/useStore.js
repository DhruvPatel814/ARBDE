import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

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

const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  requestJson: '{\n  "company": {\n    "turnover": 10000000,\n    "type": "LLC",\n    "country": "US"\n  }\n}',
  responseJson: '',
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
  isTableModalOpen: false,
  focusTableId: null,
  openTableModal: (nodeId) => set({ isTableModalOpen: true, focusTableId: nodeId }),
  closeTableModal: () => set({ isTableModalOpen: false, focusTableId: null }),
  setRequestJson: (val) => set({ requestJson: val }),
  setResponseJson: (val) => set({ responseJson: val })
}));

export default useStore;
