import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService, type WebSocketServiceCallbacks } from '../services/websocketService';
import { trendingApiService } from '../services/trendingApi';
import type { TrendingNewsResponse } from '../types/api';

export interface UseRealTimeTrendingOptions {
  autoConnect?: boolean;
  autoStartSimulation?: boolean;
  onError?: (error: string) => void;
}

export interface UseRealTimeTrendingReturn {
  // Data
  trendingNews: TrendingNewsResponse[];
  isConnected: boolean;
  isSimulating: boolean;
  connectionState: string;
  lastUpdate: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  refreshData: () => Promise<void>;
  
  // Status
  loading: boolean;
  error: string | null;
}

export const useRealTimeTrending = (options: UseRealTimeTrendingOptions = {}): UseRealTimeTrendingReturn => {
  const {
    autoConnect = true,
    autoStartSimulation = false,
    onError,
  } = options;

  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [connectionState, setConnectionState] = useState('CLOSED');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasInitialized = useRef(false);

  // Update trending news when new article arrives
  const handleNewArticle = useCallback((newArticle: TrendingNewsResponse) => {
    setTrendingNews(prev => {
      // Remove existing article with same ID if it exists
      const filtered = prev.filter(article => article.id !== newArticle.id);
      // Add new article at the beginning
      return [newArticle, ...filtered];
    });
    setLastUpdate(new Date().toISOString());
  }, []);

  // Update article scores and ranks
  const handleScoreUpdate = useCallback((update: {
    article_id: number;
    new_score: number;
    new_rank: number;
    views_count: number;
    likes_count: number;
  }) => {
    setTrendingNews(prev => {
      const updated = prev.map(article => {
        if (article.id === update.article_id) {
          return {
            ...article,
            trending_score: update.new_score,
            trending_rank: update.new_rank,
            views_count: update.views_count,
            likes_count: update.likes_count,
            last_updated: new Date().toISOString(),
          };
        }
        return article;
      });
      
      // Sort by trending score
      return updated.sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0));
    });
    setLastUpdate(new Date().toISOString());
  }, []);

  // Handle simulation state changes
  const handleSimulationStarted = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const handleSimulationStopped = useCallback(() => {
    setIsSimulating(false);
  }, []);

  // Handle connection changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setConnectionState(websocketService.getConnectionState());
  }, []);

  // Handle errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  // WebSocket callbacks
  const wsCallbacks: WebSocketServiceCallbacks = {
    onNewArticle: handleNewArticle,
    onScoreUpdate: handleScoreUpdate,
    onSimulationStarted: handleSimulationStarted,
    onSimulationStopped: handleSimulationStopped,
    onConnectionChange: handleConnectionChange,
    onError: handleError,
  };

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      setError(null);
      await websocketService.connect(wsCallbacks);
      setConnectionState(websocketService.getConnectionState());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to real-time service';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [wsCallbacks, onError]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnectionState(websocketService.getConnectionState());
  }, []);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (isConnected) {
      websocketService.startSimulation();
    }
  }, [isConnected]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (isConnected) {
      websocketService.stopSimulation();
    }
  }, [isConnected]);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trendingApiService.getLatestTrendingNews(20);
      setTrendingNews(data);
      setLastUpdate(new Date().toISOString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Initialize data and connection
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Load initial data
      refreshData();
      
      // Auto-connect if enabled
      if (autoConnect) {
        connect();
      }
    }
  }, [autoConnect, connect, refreshData]);

  // Auto-start simulation if enabled and connected
  useEffect(() => {
    if (autoStartSimulation && isConnected && !isSimulating) {
      startSimulation();
    }
  }, [autoStartSimulation, isConnected, isSimulating, startSimulation]);

  // Update connection state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionState(websocketService.getConnectionState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return {
    // Data
    trendingNews,
    isConnected,
    isSimulating,
    connectionState,
    lastUpdate,
    
    // Actions
    connect,
    disconnect,
    startSimulation,
    stopSimulation,
    refreshData,
    
    // Status
    loading,
    error,
  };
};
