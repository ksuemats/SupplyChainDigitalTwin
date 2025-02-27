import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial data
    sendMetrics(ws);

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        sendMetrics(ws);
      }
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected');
    });
  });
}

// Keep track of previous values to create smooth transitions
let previousMetrics = {
  totalNodes: 120,
  activeNodes: 115,
  averageRiskScore: 25,
  throughput: 5500,
  bottlenecks: 2,
  delayedShipments: 5,
};

function sendMetrics(ws: WebSocket) {
  // Generate slightly varied metrics based on previous values
  const metrics = {
    totalNodes: previousMetrics.totalNodes + Math.floor(Math.random() * 3) - 1, // -1 to +1 change
    activeNodes: previousMetrics.activeNodes + Math.floor(Math.random() * 5) - 2, // -2 to +2 change
    averageRiskScore: Math.max(5, Math.min(95,
      previousMetrics.averageRiskScore + (Math.random() * 4) - 2
    )), // -2 to +2 change, bounded between 5 and 95
    throughput: Math.max(1000, 
      previousMetrics.throughput + Math.floor(Math.random() * 200) - 100
    ), // -100 to +100 change, min 1000
    bottlenecks: Math.max(0,
      previousMetrics.bottlenecks + Math.floor(Math.random() * 3) - 1
    ), // -1 to +1 change, min 0
    delayedShipments: Math.max(0,
      previousMetrics.delayedShipments + Math.floor(Math.random() * 3) - 1
    ), // -1 to +1 change, min 0
    riskTrend: [] as Array<{ timestamp: string; riskScore: number }>
  };

  // Ensure activeNodes doesn't exceed totalNodes
  metrics.activeNodes = Math.min(metrics.activeNodes, metrics.totalNodes);

  // Generate risk trend data with smooth transitions
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const timeOffset = (19 - i) * 300000; // 5 minutes intervals
    const baseRisk = metrics.averageRiskScore;
    const variation = Math.sin(i / 3) * 5; // Create a wave pattern
    const noise = (Math.random() - 0.5) * 3; // Add some noise

    metrics.riskTrend.push({
      timestamp: new Date(now - timeOffset).toISOString(),
      riskScore: Math.max(0, Math.min(100, baseRisk + variation + noise))
    });
  }

  // Update previous metrics for next iteration
  previousMetrics = {
    totalNodes: metrics.totalNodes,
    activeNodes: metrics.activeNodes,
    averageRiskScore: metrics.averageRiskScore,
    throughput: metrics.throughput,
    bottlenecks: metrics.bottlenecks,
    delayedShipments: metrics.delayedShipments,
  };

  ws.send(JSON.stringify(metrics));
}