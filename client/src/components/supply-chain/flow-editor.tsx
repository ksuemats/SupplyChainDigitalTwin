import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./node-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { transformToFlowNodes, transformToFlowEdges } from "@/lib/supply-chain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function SupplyChainEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nodes = [] } = useQuery<Node[]>({
    queryKey: ["/api/nodes"],
    select: (data) => transformToFlowNodes(data)
  });

  const { data: edges = [] } = useQuery<Edge[]>({
    queryKey: ["/api/edges"],
    select: (data) => transformToFlowEdges(data)
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
    }
  });

  const onNodesChange = useCallback((changes: any) => {
    const positionChange = changes.find((change: any) => change.type === "position");
    if (positionChange) {
      updateNodeMutation.mutate({
        id: positionChange.id,
        position: positionChange.position
      });
    }
  }, [updateNodeMutation]);

  const onConnect = useCallback((connection: Connection) => {
    addEdgeMutation.mutate(connection);
  }, [addEdgeMutation]);

  return (
    <div className="w-full h-[80vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
