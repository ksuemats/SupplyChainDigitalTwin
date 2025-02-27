import { useCallback, useState, DragEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type ReactFlowInstance
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./node-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { transformToFlowNodes, transformToFlowEdges } from "@/lib/supply-chain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SupplyChainEditorProps {
  onNodeSelect?: (nodeId: number) => void;
}

export function SupplyChainEditorContent({ onNodeSelect }: SupplyChainEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const { data: apiNodes = [] } = useQuery({
    queryKey: ["/api/nodes"],
    select: (data) => transformToFlowNodes(data)
  });

  const { data: apiEdges = [] } = useQuery({
    queryKey: ["/api/edges"],
    select: (data) => transformToFlowEdges(data)
  });

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          name: `New ${type}`,
          location: 'Location',
          capacity: 'Capacity',
          region: 'Region',
          market: 'Market'
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        setEdges((eds) => addEdge(params, eds));
        toast({
          title: "Connected",
          description: `Connected node ${params.source} to ${params.target}`
        });
      }
    },
    [setEdges, toast]
  );

  const handleNodeClick = useCallback((event: any, node: Node) => {
    onNodeSelect?.(parseInt(node.id));
  }, [onNodeSelect]);

  return (
    <div 
      className="w-full h-full absolute inset-0 flex" // Added flex to parent
      onDragOver={onDragOver} 
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onInit={setReactFlowInstance}
        proOptions={{ hideAttribution: true }}
        style={{ width: '100%', height: '100%' }} //Explicit width and height
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground text-sm">
            Drag and drop components here to build your supply chain network
          </p>
        </div>
      )}
    </div>
  );
}

export function SupplyChainEditor(props: SupplyChainEditorProps) {
  return (
    <ReactFlowProvider>
      <SupplyChainEditorContent {...props} />
    </ReactFlowProvider>
  );
}