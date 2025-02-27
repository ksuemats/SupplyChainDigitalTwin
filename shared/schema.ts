import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const supplyChainNodes = pgTable("supply_chain_nodes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // supplier, manufacturer, distributor, retailer
  position: jsonb("position").notNull(), // x, y coordinates
  data: jsonb("data").notNull(), // custom node data
});

export const supplyChainEdges = pgTable("supply_chain_edges", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  target: text("target").notNull(),
  data: jsonb("data").notNull(), // edge data like transport time, cost etc
});

export const riskAnalysis = pgTable("risk_analysis", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  riskScore: integer("risk_score").notNull(),
  analysisData: jsonb("analysis_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNodeSchema = createInsertSchema(supplyChainNodes).omit({ id: true });
export const insertEdgeSchema = createInsertSchema(supplyChainEdges).omit({ id: true });
export const insertRiskAnalysisSchema = createInsertSchema(riskAnalysis).omit({ id: true, createdAt: true });

export type SupplyChainNode = typeof supplyChainNodes.$inferSelect;
export type SupplyChainEdge = typeof supplyChainEdges.$inferSelect;
export type RiskAnalysis = typeof riskAnalysis.$inferSelect;

export type InsertNode = z.infer<typeof insertNodeSchema>;
export type InsertEdge = z.infer<typeof insertEdgeSchema>;
export type InsertRiskAnalysis = z.infer<typeof insertRiskAnalysisSchema>;
