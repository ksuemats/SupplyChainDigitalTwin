import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSupplyChainRisk } from "./openai";
import { insertNodeSchema, insertEdgeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Supply Chain Nodes
  app.get("/api/nodes", async (req, res) => {
    const nodes = await storage.getNodes();
    res.json(nodes);
  });

  app.post("/api/nodes", async (req, res) => {
    const result = insertNodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const node = await storage.createNode(result.data);
    res.json(node);
  });

  app.patch("/api/nodes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertNodeSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const node = await storage.updateNode(id, result.data);
    res.json(node);
  });

  app.delete("/api/nodes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNode(id);
    res.sendStatus(204);
  });

  // Supply Chain Edges
  app.get("/api/edges", async (req, res) => {
    const edges = await storage.getEdges();
    res.json(edges);
  });

  app.post("/api/edges", async (req, res) => {
    const result = insertEdgeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const edge = await storage.createEdge(result.data);
    res.json(edge);
  });

  app.delete("/api/edges/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteEdge(id);
    res.sendStatus(204);
  });

  // Risk Analysis
  app.get("/api/risk-analysis/:nodeId", async (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const analysis = await storage.getRiskAnalysis(nodeId);
    res.json(analysis);
  });

  app.post("/api/risk-analysis/:nodeId", async (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = await storage.getNode(nodeId);
    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    try {
      const riskAssessment = await analyzeSupplyChainRisk(node);
      const analysis = await storage.createRiskAnalysis({
        nodeId,
        riskScore: riskAssessment.riskScore,
        analysisData: riskAssessment
      });
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze risk" });
    }
  });

  return httpServer;
}
