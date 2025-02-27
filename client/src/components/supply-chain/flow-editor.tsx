import { useCallback, useState, DragEvent, useEffect } from "react";
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
import { NodeCreationPanel } from "./node-creation-panel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { transformToFlowNodes, transformToFlowEdges } from "@/lib/supply-chain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SupplyChainEditorProps {
  onNodeSelect?: (nodeId: number) => void;
}

function SupplyChainEditorContent({ onNodeSelect }: SupplyChainEditorProps) {
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

  useEffect(() => {
    setNodes(apiNodes);
    setEdges(apiEdges);
  }, [apiNodes, apiEdges, setNodes, setEdges]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log('No flow instance available');
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        console.log('No node type data found');
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX - bounds.left;
      const clientY = event.clientY - bounds.top;

      console.log('Drop coordinates:', { clientX, clientY });
      console.log('Container bounds:', bounds);

      // Use a test position first
      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      console.log('Calculated position:', position);

      // Test with direct node creation first
      const newNode = {
        id: `test-${Date.now()}`,
        type,
        position,
        data: {
          name: `Test ${type}`,
          location: 'Test Location',
          capacity: 'Test Capacity',
          region: 'Test Region',
          market: 'Test Market'
        }
      };

      console.log('Creating new node:', newNode);
      setNodes((nds) => nds.concat(newNode));

      toast({
        title: "Debug",
        description: `Attempted to create node at x:${position.x}, y:${position.y}`
      });
    },
    [reactFlowInstance, setNodes, toast]
  );

  const handleNodeClick = useCallback((event: any, node: Node) => {
    onNodeSelect?.(parseInt(node.id));
  }, [onNodeSelect]);

  return (
    <div className="w-full h-[80vh] relative border rounded-lg bg-background">
      <NodeCreationPanel />
      <div className="absolute inset-0" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
          proOptions={{ hideAttribution: true }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

// Wrap the editor with ReactFlowProvider
export function SupplyChainEditor(props: SupplyChainEditorProps) {
  return (
    <ReactFlowProvider>
      <SupplyChainEditorContent {...props} />
    </ReactFlowProvider>
  );
}