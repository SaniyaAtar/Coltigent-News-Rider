import { useState, useEffect, useCallback } from 'react';
import { trendingApiService, cachedTrendingApi } from '../services/trendingApi';
import type { TrendingNewsResponse, TrendingCategoriesResponse } from '../types/api';

export interface UseTrendingNewsOptions {
  limit?: number;
  category?: string;
  useCache?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export interface UseTrendingNewsReturn {
  trendingNews: TrendingNewsResponse[];
  categories: TrendingCategoriesResponse[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshTrending: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const useTrendingNews = (options: UseTrendingNewsOptions = {}): UseTrendingNewsReturn => {
  const {
    limit = 10,
    category,
    useCache = true,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [categories, setCategories] = useState<TrendingCategoriesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTrendingNews = useCallback(async (page: number = 1, reset: boolean = false) => {
    try {
      setError(null);
      if (reset) {
        setLoading(true);
      }

      let news: TrendingNewsResponse[];
      
      if (category) {
        // Use the new trending list API endpoint for category-specific news
        console.log(`useTrendingNews: Fetching ${category} category news using new /news/trending/list endpoint`);
        news = await trendingApiService.getTrendingNewsByCategory(category, page, limit);
        setHasMore(news.length === limit);
      } else if (page === 1) {
        // For first page, use cached latest trending news
        news = useCache 
          ? await cachedTrendingApi.getLatestTrendingNews(limit)
          : await trendingApiService.getLatestTrendingNews(limit);
        setHasMore(news.length === limit);
      } else {
        news = await trendingApiService.getTrendingNews(page, limit);
        setHasMore(news.length === limit);
      }

      if (reset) {
        setTrendingNews(news);
        setCurrentPage(1);
      } else {
        setTrendingNews(prev => [...prev, ...news]);
        setCurrentPage(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending news');
    } finally {
      setLoading(false);
    }
  }, [limit, category, useCache]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = useCache 
        ? await cachedTrendingApi.getTrendingCategories()
        : await trendingApiService.getTrendingCategories();
      // Transform string array to TrendingCategoriesResponse array
      const transformedCats = cats.map((cat, index) => ({
        id: index + 1,
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
        description: `${cat} trending news`,
        color: '#007bff',
        trending_count: 0
      }));
      setCategories(transformedCats);
    } catch (err) {
      console.error('Failed to fetch trending categories:', err);
    }
  }, [useCache]);

  const refresh = useCallback(async () => {
    await fetchTrendingNews(1, true);
  }, [fetchTrendingNews]);

  const refreshTrending = useCallback(async () => {
    try {
      setError(null);
      await trendingApiService.refreshTrendingNews();
      // Refresh the news after manual refresh
      await fetchTrendingNews(1, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh trending news');
    }
  }, [fetchTrendingNews]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchTrendingNews(currentPage + 1, false);
    }
  }, [loading, hasMore, currentPage, fetchTrendingNews]);

  // Initial load
  useEffect(() => {
    fetchTrendingNews(1, true);
    fetchCategories();
  }, [fetchTrendingNews, fetchCategories]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTrendingNews(1, true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTrendingNews]);

  return {
    trendingNews,
    categories,
    loading,
    error,
    refresh,
    refreshTrending,
    hasMore,
    loadMore,
  };
};

// Hook for top trending news only
export const useTopTrendingNews = (limit: number = 5) => {
  const [topTrending, setTopTrending] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopTrending = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const news = await cachedTrendingApi.getTopTrendingNews(limit);
      setTopTrending(news);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top trending news');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopTrending();
  }, [fetchTopTrending]);

  return {
    topTrending,
    loading,
    error,
    refresh: fetchTopTrending,
  };
};

