import { useCallback, useState, DragEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./node-types";
import { NodeCreationPanel } from "./node-creation-panel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { transformToFlowNodes, transformToFlowEdges } from "@/lib/supply-chain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SupplyChainEditorProps {
  onNodeSelect?: (nodeId: number) => void;
}

export function SupplyChainEditor({ onNodeSelect }: SupplyChainEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const { data: apiNodes = [] } = useQuery({
    queryKey: ["/api/nodes"],
    select: (data) => transformToFlowNodes(data)
  });

  const { data: apiEdges = [] } = useQuery({
    queryKey: ["/api/edges"],
    select: (data) => transformToFlowEdges(data)
  });

  // Keep local state in sync with API data
  useState(() => {
    setNodes(apiNodes);
    setEdges(apiEdges);
  }, [apiNodes, apiEdges]);

  const createNodeMutation = useMutation({
    mutationFn: async (node: { type: string, position: { x: number, y: number }, data: any }) => {
      await apiRequest("POST", "/api/nodes", node);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      toast({
        title: "Success",
        description: "Node created successfully"
      });
    }
  });

  const updateNodeMutation = useMutation({
    mutationFn: async ({ id, position }: { id: string, position: { x: number, y: number }}) => {
      await apiRequest("PATCH", `/api/nodes/${id}`, { position });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
    }
  });

  const addEdgeMutation = useMutation({
    mutationFn: async (connection: Connection) => {
      await apiRequest("POST", "/api/edges", {
        source: connection.source,
        target: connection.target,
        data: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/edges"] });
      toast({
        title: "Success",
        description: "Connection created successfully"
      });
    }
  });

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeData = {
        name: `New ${type}`,
        location: 'Location',
        capacity: 'Capacity',
        region: 'Region',
        market: 'Market'
      };

      createNodeMutation.mutate({
        type,
        position,
        data: nodeData
      });
    },
    [reactFlowInstance, createNodeMutation]
  );

  const handleNodesChange = useCallback((changes: any) => {
    const positionChange = changes.find((change: any) => change.type === "position");
    if (positionChange) {
      updateNodeMutation.mutate({
        id: positionChange.id,
        position: positionChange.position
      });
    }
    onNodesChange(changes);
  }, [updateNodeMutation, onNodesChange]);

  const handleConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      addEdgeMutation.mutate(params);
      setEdges((eds) => addEdge(params, eds));
    }
  }, [addEdgeMutation, setEdges]);

  const handleNodeClick = useCallback((event: any, node: Node) => {
    onNodeSelect?.(parseInt(node.id));
  }, [onNodeSelect]);

  return (
    <div className="w-full h-[80vh] relative border rounded-lg">
      <NodeCreationPanel />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}