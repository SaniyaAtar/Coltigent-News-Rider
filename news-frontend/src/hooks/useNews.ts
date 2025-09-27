import { useApi, usePaginatedApi } from './useApi';
import { newsApiService, cachedNewsApi } from '../services/newsApi';
import type { NewsFilters } from '../types/api';

// Hook for fetching breaking news
export function useBreakingNews(limit: number = 5) {
  return useApi(
    () => cachedNewsApi.getBreakingNews(limit),
    { immediate: true }
  );
}

// Hook for fetching trending news
export function useTrendingNews(limit: number = 10) {
  return useApi(
    () => cachedNewsApi.getTrendingNews(limit),
    { immediate: true }
  );
}

// Hook for fetching latest news
export function useLatestNews(limit: number = 10) {
  return useApi(
    () => cachedNewsApi.getLatestNews(limit),
    { immediate: true }
  );
}

// Hook for fetching single news item
export function useNewsItem(id: number) {
  return useApi(
    () => newsApiService.getNewsById(id),
    { immediate: !!id }
  );
}

// Hook for fetching news by category
export function useNewsByCategory(category: string, limit: number = 10) {
  return useApi(
    () => newsApiService.getNewsByCategory(category, limit),
    { immediate: !!category }
  );
}

// Hook for searching news
export function useNewsSearch(query: string, limit: number = 10) {
  return useApi(
    () => newsApiService.searchNews(query, limit),
    { immediate: !!query && query.length > 2 }
  );
}

// Hook for paginated news
export function usePaginatedNews(filters: NewsFilters = {}) {
  return usePaginatedApi(
    (page: number) => newsApiService.getNews({ ...filters, page }),
    { immediate: true, pageSize: filters.size || 10 }
  );
}

// Hook for trending hashtags
export function useTrendingHashtags(limit: number = 10) {
  return useApi(
    () => cachedNewsApi.getTrendingHashtags(limit),
    { immediate: true }
  );
}

// Hook for categories
export function useCategories() {
  return useApi(
    () => cachedNewsApi.getCategories(),
    { immediate: true }
  );
}

// Hook for video news
export function useVideoNews(limit: number = 10) {
  return useApi(
    () => newsApiService.getVideoNews(limit),
    { immediate: true }
  );
}

// Hook for single video news
export function useVideoNewsItem(id: number) {
  return useApi(
    () => newsApiService.getVideoNewsById(id),
    { immediate: !!id }
  );
}

// Hook for incrementing view count
export function useIncrementView() {
  const { execute, loading, error } = useApi(
    (id: number) => newsApiService.incrementViewCount(id)
  );

  const incrementView = (id: number) => {
    execute(id).catch(console.error); // Silently handle errors for view counting
  };

  return { incrementView, loading, error };
}

