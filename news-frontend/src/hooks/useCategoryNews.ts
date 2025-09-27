import { useState, useEffect } from 'react';
import { trendingApiService } from '../services/trendingApi';
import type { TrendingNewsResponse } from '../types/api';

interface UseCategoryNewsOptions {
  page?: number;
  size?: number;
  useCache?: boolean;
}

interface UseCategoryNewsReturn {
  data: TrendingNewsResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategoryNews = (
  category: string,
  page: number = 1,
  size: number = 10,
  _options: UseCategoryNewsOptions = {}
): UseCategoryNewsReturn => {
  // Note: options parameter is available for future use (useCache, etc.)
  
  const [data, setData] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!category) {
      setData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`useCategoryNews: Fetching ${category} news using new /news/trending/list endpoint`);
      
      // Use the new API endpoint: GET /news/trending/list?category_type=tech&page=1&size=10
      const newsData = await trendingApiService.getTrendingNewsByCategory(category, page, size);
      
      // ✅ Additional client-side filtering to ensure strict category matching
      const filteredData = newsData.filter(article => 
        article.category && 
        article.category.toLowerCase() === category.toLowerCase()
      );
      
      console.log(`useCategoryNews: Successfully fetched ${filteredData.length} articles for ${category} (filtered from ${newsData.length} total)`);
      setData(filteredData);
    } catch (err) {
      console.error(`useCategoryNews: Error fetching ${category} news:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch category news');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, page, size]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
