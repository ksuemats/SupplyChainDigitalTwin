import { type Node, type Edge } from "reactflow";
import { type SupplyChainNode, type SupplyChainEdge } from "@shared/schema";

export const NODE_TYPES = {
  // Production
  supplier: "Raw Material Supplier",
  manufacturer: "Manufacturing Plant",
  processor: "Processing Facility",

  // Storage & Distribution
  warehouse: "Warehouse",
  distributor: "Distribution Center",
  crossdock: "Cross-Dock Facility",

  // Sales & Delivery
  retailer: "Retail Store",
  wholesaler: "Wholesale Center",
  lastmile: "Last-Mile Hub",

  // Special Facilities
  coldchain: "Cold Storage Facility",
  customs: "Customs Facility",
  quality: "Quality Control Center"
} as const;

export const NODE_CATEGORIES = {
  production: ["supplier", "manufacturer", "processor"],
  storage: ["warehouse", "distributor", "crossdock"],
  sales: ["retailer", "wholesaler", "lastmile"],
  specialized: ["coldchain", "customs", "quality"]
} as const;

export function transformToFlowNodes(nodes: SupplyChainNode[]): Node[] {
  return nodes.map(node => ({
    id: node.id.toString(),
    type: node.type,
    position: node.position as { x: number; y: number },
    data: node.data
  }));
}

export function transformToFlowEdges(edges: SupplyChainEdge[]): Edge[] {
  return edges.map(edge => ({
    id: edge.id.toString(),
    source: edge.source,
    target: edge.target,
    data: edge.data
  }));
}

export function calculateNodeRiskColor(riskScore: number): string {
  if (riskScore < 30) return "bg-green-500";
  if (riskScore < 70) return "bg-yellow-500";
  return "bg-red-500";
}