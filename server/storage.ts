import { 
  type SupplyChainNode, 
  type SupplyChainEdge,
  type RiskAnalysis,
  type InsertNode,
  type InsertEdge,
  type InsertRiskAnalysis
} from "@shared/schema";

export interface IStorage {
  // Supply Chain Nodes
  getNodes(): Promise<SupplyChainNode[]>;
  getNode(id: number): Promise<SupplyChainNode | undefined>;
  createNode(node: InsertNode): Promise<SupplyChainNode>;
  updateNode(id: number, node: Partial<InsertNode>): Promise<SupplyChainNode>;
  deleteNode(id: number): Promise<void>;

  // Supply Chain Edges
  getEdges(): Promise<SupplyChainEdge[]>;
  createEdge(edge: InsertEdge): Promise<SupplyChainEdge>;
  deleteEdge(id: number): Promise<void>;

  // Risk Analysis
  getRiskAnalysis(nodeId: number): Promise<RiskAnalysis[]>;
  createRiskAnalysis(analysis: InsertRiskAnalysis): Promise<RiskAnalysis>;
}

export class MemStorage implements IStorage {
  private nodes: Map<number, SupplyChainNode>;
  private edges: Map<number, SupplyChainEdge>;
  private riskAnalyses: Map<number, RiskAnalysis>;
  private currentNodeId: number;
  private currentEdgeId: number;
  private currentRiskId: number;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.riskAnalyses = new Map();
    this.currentNodeId = 1;
    this.currentEdgeId = 1;
    this.currentRiskId = 1;
  }

  async getNodes(): Promise<SupplyChainNode[]> {
    return Array.from(this.nodes.values());
  }

  async getNode(id: number): Promise<SupplyChainNode | undefined> {
    return this.nodes.get(id);
  }

  async createNode(node: InsertNode): Promise<SupplyChainNode> {
    const id = this.currentNodeId++;
    const newNode = { ...node, id };
    this.nodes.set(id, newNode);
    return newNode;
  }

  async updateNode(id: number, update: Partial<InsertNode>): Promise<SupplyChainNode> {
    const node = this.nodes.get(id);
    if (!node) throw new Error(`Node ${id} not found`);
    
    const updatedNode = { ...node, ...update };
    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  async deleteNode(id: number): Promise<void> {
    this.nodes.delete(id);
  }

  async getEdges(): Promise<SupplyChainEdge[]> {
    return Array.from(this.edges.values());
  }

  async createEdge(edge: InsertEdge): Promise<SupplyChainEdge> {
    const id = this.currentEdgeId++;
    const newEdge = { ...edge, id };
    this.edges.set(id, newEdge);
    return newEdge;
  }

  async deleteEdge(id: number): Promise<void> {
    this.edges.delete(id);
  }

  async getRiskAnalysis(nodeId: number): Promise<RiskAnalysis[]> {
    return Array.from(this.riskAnalyses.values())
      .filter(analysis => analysis.nodeId === nodeId);
  }

  async createRiskAnalysis(analysis: InsertRiskAnalysis): Promise<RiskAnalysis> {
    const id = this.currentRiskId++;
    const newAnalysis = { 
      ...analysis, 
      id, 
      createdAt: new Date() 
    };
    this.riskAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }
}

export const storage = new MemStorage();
