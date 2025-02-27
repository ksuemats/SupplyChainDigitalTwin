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
    totalNodes: 0,
    activeNodes: 0,
    averageRiskScore: 0,
    throughput: 0,
    bottlenecks: 0,
    delayedShipments: 0,
    riskTrend: []
  },
  updateMetrics: (data) => set((state) => ({
    metrics: { ...state.metrics, ...data }
  }))
}))
