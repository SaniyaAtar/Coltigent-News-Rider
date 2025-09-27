import type { TrendingNewsResponse } from '../types/api';

export interface RealTimeUpdate {
  type: 'new_article' | 'update_score' | 'simulation_started' | 'simulation_stopped';
  data: any;
  timestamp: string;
}

export interface WebSocketServiceCallbacks {
  onNewArticle?: (article: TrendingNewsResponse) => void;
  onScoreUpdate?: (update: { article_id: number; new_score: number; new_rank: number; views_count: number; likes_count: number }) => void;
  onSimulationStarted?: () => void;
  onSimulationStopped?: () => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketServiceCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private isConnecting = false;
  private baseUrl: string;

  constructor(baseUrl: string = 'ws://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  connect(callbacks: WebSocketServiceCallbacks = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.callbacks = callbacks;

      try {
        this.ws = new WebSocket(`${this.baseUrl}/ws/trending`);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.callbacks.onConnectionChange?.(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const update: RealTimeUpdate = JSON.parse(event.data);
            this.handleMessage(update);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            this.callbacks.onError?.('Failed to parse server message');
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.callbacks.onConnectionChange?.(false);
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.callbacks.onError?.('WebSocket connection error');
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleMessage(update: RealTimeUpdate): void {
    switch (update.type) {
      case 'new_article':
        this.callbacks.onNewArticle?.(update.data);
        break;
      case 'update_score':
        this.callbacks.onScoreUpdate?.(update.data);
        break;
      case 'simulation_started':
        this.callbacks.onSimulationStarted?.();
        break;
      case 'simulation_stopped':
        this.callbacks.onSimulationStopped?.();
        break;
      default:
        console.log('Unknown message type:', update.type);
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect(this.callbacks).catch((error) => {
        console.error('Reconnection failed:', error);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.callbacks.onError?.('Failed to reconnect after multiple attempts');
        }
      });
    }, this.reconnectInterval);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  startSimulation(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send('start_simulation');
    }
  }

  stopSimulation(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send('stop_simulation');
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();
