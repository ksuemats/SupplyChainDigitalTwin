import { create } from 'zustand'

interface WebSocketStore {
  socket: WebSocket | null
  connect: () => void
  disconnect: () => void
}

export const useWebSocket = create<WebSocketStore>((set) => ({
  socket: null,
  connect: () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}/ws`
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('WebSocket Connected')
    }

    socket.onmessage = (event) => {
      console.log('WebSocket Message Received:', event.data)
      try {
        const data = JSON.parse(event.data)
        useMetricsStore.getState().updateMetrics(data)
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket Disconnected')
    }

    set({ socket })
  },
  disconnect: () => {
    set((state) => {
      state.socket?.close()
      return { socket: null }
    })
  }
}))

interface MetricsStore {
  metrics: {
    totalNodes: number
    activeNodes: number
    averageRiskScore: number
    throughput: number
    bottlenecks: number
    delayedShipments: number
    riskTrend: Array<{
      timestamp: string
      riskScore: number
    }>
  }
  updateMetrics: (data: any) => void
}

export const useMetricsStore = create<MetricsStore>((set) => ({
  metrics: {
    totalNodes: 50,
    activeNodes: 23,
    averageRiskScore: 76,
    throughput: 10,
    bottlenecks: 12,
    delayedShipments: 12,
    riskTrend: [
      { "timestamp": "2025-02-27T09:00:00Z", "riskScore": 25.0 },
      { "timestamp": "2025-02-27T09:05:00Z", "riskScore": 28.0 },
      { "timestamp": "2025-02-27T09:10:00Z", "riskScore": 34.2 },
      { "timestamp": "2025-02-27T09:15:00Z", "riskScore": 43.0 },
      { "timestamp": "2025-02-27T09:20:00Z", "riskScore": 45.0 },
      { "timestamp": "2025-02-27T09:25:00Z", "riskScore": 54.0 },
      { "timestamp": "2025-02-27T09:30:00Z", "riskScore": 78.0 },
      { "timestamp": "2025-02-27T09:35:00Z", "riskScore": 80.0 },
      { "timestamp": "2025-02-27T09:40:00Z", "riskScore": 90.0 },
      { "timestamp": "2025-02-27T09:45:00Z", "riskScore": 101.0 }

    ]
  },
  updateMetrics: (data) => {
    console.log('Updating metrics with:', data)
    set((state) => ({
      metrics: { ...state.metrics, ...data }
    }))
  }
}))