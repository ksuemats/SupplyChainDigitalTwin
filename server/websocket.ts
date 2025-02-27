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

function sendMetrics(ws: WebSocket) {
  // Generate sample metrics (replace with actual data in production)
  const metrics = {
    totalNodes: Math.floor(Math.random() * 50) + 100,
    activeNodes: Math.floor(Math.random() * 40) + 90,
    averageRiskScore: Math.random() * 30 + 10,
    throughput: Math.floor(Math.random() * 1000) + 5000,
    bottlenecks: Math.floor(Math.random() * 5),
    delayedShipments: Math.floor(Math.random() * 10),
    riskTrend: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 300000).toISOString(),
      riskScore: Math.random() * 30 + 10
    }))
  };

  ws.send(JSON.stringify(metrics));
}
