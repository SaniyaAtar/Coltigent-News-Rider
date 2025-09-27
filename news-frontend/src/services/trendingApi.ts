import { apiClient } from './apiClient';
import { withCache } from './cache';
import type {
  TrendingNewsResponse,
  TrendingRefreshResponse,
} from '../types/api';

// Backend API response interfaces
interface BackendTrendingNewsResponse {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  category_type?: string;
  source: string;
  source_url: string;
  published_date?: string;
  main_image_url?: string;
  main_image_s3_url?: string;
  created_at: string;
  updated_at?: string;
  trending_score?: number;
}

interface BackendTrendingNewsList {
  articles: BackendTrendingNewsResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Trending News API Service
export class TrendingApiService {
  private readonly baseUrl = '/api/v1/news/trending';

  // Get trending news
  async getTrendingNews(page: number = 1, size: number = 10): Promise<TrendingNewsResponse[]> {
    const response = await apiClient.get<BackendTrendingNewsList>(`${this.baseUrl}/`, {
      params: { page, size }
    });
    return this.transformBackendResponse(response.data.articles);
  }

  // Get latest trending news
  async getLatestTrendingNews(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending news with limit:', limit);
      console.log('API Client base URL:', apiClient.defaults.baseURL);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { limit }
        });
        console.log('Primary endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { limit }
        });
        console.log('Alternative endpoint response:', response.data);
      }
      
      console.log('Response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        return this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        return this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        return this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        return this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching latest trending news:', error);
      throw error;
    }
  }

  // Get latest trending national news for carousel (source=national, category=trending)
  async getLatestTrendingNationalNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending national news with limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Primary trending national endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary trending national endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative trending national endpoint response:', response.data);
      }
      
      console.log('Trending national response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.error('Unexpected trending national response structure:', response.data);
        return [];
      }

      // Additional client-side filtering to ensure we only get national trending news
      const filteredArticles = articles.filter(article => 
        article.source?.toLowerCase() === 'national' && 
        article.category?.toLowerCase() === 'trending'
      );

      console.log(`Found ${filteredArticles.length} trending national articles after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending national news:', error);
      throw error;
    }
  }

  // Transform backend response to frontend format
  private transformBackendResponse(backendNews: BackendTrendingNewsResponse[]): TrendingNewsResponse[] {
    return backendNews.map((item, index) => ({
      id: item.id,
      title: item.title || 'No title',
      description: item.summary || item.content || '',
      content: item.content || item.summary || '',
      image_url: item.main_image_s3_url || item.main_image_url,
      published_at: item.published_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      category: item.category || 'General',
      category_type: item.category_type,
      author: item.source || 'Unknown',
      source: item.source || 'Unknown',
      read_more_url: item.source_url,
      is_breaking: false, // Will be determined by trending score or other logic
      is_trending: true, // Assume trending if from trending API
      trending_score: item.trending_score || 0,
      trending_rank: index + 1, // Set rank based on position
      is_live: true,
      last_updated: item.updated_at || item.created_at
    }));
  }

  // Get available trending categories
  async getTrendingCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${this.baseUrl}/categories`);
    return response.data;
  }

  // Manual refresh of trending news
  async refreshTrendingNews(): Promise<TrendingRefreshResponse> {
    const response = await apiClient.post<TrendingRefreshResponse>(`${this.baseUrl}/refresh`);
    return response.data;
  }

  // Get trending news by category using the new endpoint
  async getTrendingNewsByCategory(
    category: string,
    page: number = 1,
    size: number = 10
  ): Promise<TrendingNewsResponse[]> {
    try {
      console.log(`Fetching trending news for category: ${category}, page: ${page}, size: ${size}`);
      
      // Use the new endpoint: GET /news/trending/list?category_type=tech&page=1&size=10
      const response = await apiClient.get<BackendTrendingNewsList>('/news/trending/list', {
        params: { 
          category_type: category,
          page, 
          size 
        }
      });
      
      console.log(`Received ${response.data.articles?.length || 0} articles for ${category} category`);
      return this.transformBackendResponse(response.data.articles);
    } catch (error) {
      console.error(`Error fetching trending news for category ${category}:`, error);
      throw error;
    }
  }

  // Get top trending news (highest trending score)
  async getTopTrendingNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    const response = await apiClient.get<BackendTrendingNewsList>(`${this.baseUrl}/frontend`);
    const transformed = this.transformBackendResponse(response.data.articles);
    // Sort by trending score and return top results
    return transformed
      .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
      .slice(0, limit);
  }

  // Get test trending news for development
  async getTestTrendingNews(limit: number = 15): Promise<TrendingNewsResponse[]> {
    const response = await apiClient.get<BackendTrendingNewsList>(`${this.baseUrl}/test`, {
      params: { limit }
    });
    return this.transformBackendResponse(response.data.articles);
  }

  // Get all breaking news from trending_news table with category=breaking
  async getAllBreakingNewsFromTrending(limit: number = 20): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching all breaking news from trending_news table with limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'breaking',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('All breaking news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary breaking news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'breaking',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative breaking news endpoint response:', response.data);
      }
      
      console.log('All breaking news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const breakingNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return breakingNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const breakingNews = this.transformBackendResponse((response.data as any).trending_news);
        return breakingNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const breakingNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return breakingNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected breaking news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching all breaking news from trending table:', error);
      throw error;
    }
  }

  // Get breaking news from trending_news table with category=breaking (for backward compatibility)
  async getBreakingNewsFromTrending(limit: number = 3): Promise<TrendingNewsResponse[]> {
    const allBreakingNews = await this.getAllBreakingNewsFromTrending(limit + 10); // Fetch more to ensure we have enough
    return allBreakingNews.slice(0, limit);
  }

  // Get remaining breaking news (excluding top 3) for latest section
  async getRemainingBreakingNewsForLatest(excludeCount: number = 3, limit: number = 10): Promise<TrendingNewsResponse[]> {
    const allBreakingNews = await this.getAllBreakingNewsFromTrending(excludeCount + limit + 5); // Fetch more to ensure we have enough
    return allBreakingNews.slice(excludeCount, excludeCount + limit);
  }

  // Get popular news from trending_news table with category=popular
  async getPopularNewsFromTrending(limit: number = 20): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching popular news from trending_news table with limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'popular',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Popular news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary popular news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'popular',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative popular news endpoint response:', response.data);
      }
      
      console.log('Popular news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const popularNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return popularNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const popularNews = this.transformBackendResponse((response.data as any).trending_news);
        return popularNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const popularNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return popularNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected popular news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching popular news from trending table:', error);
      throw error;
    }
  }

  // Get national news from trending_news table with exact query: source='national' (all categories)
  async getNationalTrendingNews(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching national news with exact query: source=national (all categories), limit:', limit);
      
      // Try the primary endpoint first with exact query parameters
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national' (all categories)
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('National news endpoint response (source=national, all categories):', response.data);
        console.log('National news - checking source values:', response.data?.articles?.map((item: any) => ({ id: item.id, title: item.title, source: item.source })));
      } catch (primaryError) {
        console.warn('Primary national news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint with same exact parameters
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national' (all categories)
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative national news endpoint response (source=national, all categories):', response.data);
        console.log('Alternative National news - checking source values:', response.data?.articles?.map((item: any) => ({ id: item.id, title: item.title, source: item.source })));
      }
      
      console.log('National news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const nationalNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const nationalNews = this.transformBackendResponse((response.data as any).trending_news);
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const nationalNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected national news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching national news from trending table:', error);
      throw error;
    }
  }

  // Get world news from trending_news table with exact query: source='world' (all categories)
  async getWorldTrendingNews(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching world news with exact query: source=world (all categories), limit:', limit);
      
      // Try the primary endpoint first with exact query parameters
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',       // Exact match: source='world' (all categories)
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('World news endpoint response (source=world, all categories):', response.data);
        console.log('World news - checking source values:', response.data?.articles?.map((item: any) => ({ id: item.id, title: item.title, source: item.source })));
      } catch (primaryError) {
        console.warn('Primary world news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint with same exact parameters
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',       // Exact match: source='world' (all categories)
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative world news endpoint response (source=world, all categories):', response.data);
        console.log('Alternative World news - checking source values:', response.data?.articles?.map((item: any) => ({ id: item.id, title: item.title, source: item.source })));
      }
      
      console.log('World news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const worldNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return worldNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const worldNews = this.transformBackendResponse((response.data as any).trending_news);
        return worldNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const worldNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return worldNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected world news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching world news from trending table:', error);
      throw error;
    }
  }

  // Get world news excluding trending category (source=world, category!=trending) for featured stories
  async getWorldNewsExcludingTrending(limit: number = 20, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching world news excluding trending category with source=world, category!=trending, limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'world',       // Exact match: source='world'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('World news excluding trending endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary world news excluding trending endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'world',       // Exact match: source='world'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative world news excluding trending endpoint response:', response.data);
      }
      
      console.log('World news excluding trending response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected world news excluding trending response structure:', response.data);
        return [];
      }

      // Client-side filtering to exclude only trending category
      const filteredArticles = articles.filter(article => {
        const category = article.category?.toLowerCase();
        const source = article.source?.toLowerCase();
        const isNotTrending = category !== 'trending';
        const isWorld = source === 'world';
        
        console.log(`World Article "${article.title}" - category: ${category}, source: ${source}, isWorld: ${isWorld}, isNotTrending: ${isNotTrending}`);
        
        return isWorld && isNotTrending;
      });

      console.log(`Filtered ${filteredArticles.length} world news articles (excluding trending) from ${articles.length} total articles`);
      return filteredArticles;
    } catch (error) {
      console.error('Error fetching world news excluding trending:', error);
      throw error;
    }
  }

  // Get sports news excluding trending category (category!=trending, category_type=sport) for sports featured stories
  async getSportsNewsExcludingTrending(limit: number = 20, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching sports news excluding trending category with category!=trending, category_type=sport, limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            category_type: 'sport',   // Exact match: category_type='sport'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Sports news excluding trending endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary sports news excluding trending endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            category_type: 'sport',   // Exact match: category_type='sport'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative sports news excluding trending endpoint response:', response.data);
      }
      
      console.log('Sports news excluding trending response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected sports news excluding trending response structure:', response.data);
        return [];
      }

      // Client-side filtering to exclude only trending category
      const filteredArticles = articles.filter(article => {
        const category = article.category?.toLowerCase();
        const categoryType = article.category_type?.toLowerCase();
        const isNotTrending = category !== 'trending';
        const isSport = categoryType === 'sport';
        
        console.log(`Sports Article "${article.title}" - category: ${category}, category_type: ${categoryType}, isSport: ${isSport}, isNotTrending: ${isNotTrending}`);
        
        return isSport && isNotTrending;
      });

      console.log(`Filtered ${filteredArticles.length} sports news articles (excluding trending) from ${articles.length} total articles`);
      return filteredArticles;
    } catch (error) {
      console.error('Error fetching sports news excluding trending:', error);
      throw error;
    }
  }

  // Get world trending news (source=world, category=trending) for world news headlines
  async getLatestTrendingWorldNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending world news with source=world, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Primary trending world endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary trending world endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative trending world endpoint response:', response.data);
      }
      
      console.log('Trending world response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.error('Unexpected trending world response structure:', response.data);
        return [];
      }

      // Additional client-side filtering to ensure we only get world trending news
      const filteredArticles = articles.filter(article => 
        article.source?.toLowerCase() === 'world' && 
        article.category?.toLowerCase() === 'trending'
      );

      console.log(`Found ${filteredArticles.length} trending world articles after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending world news:', error);
      throw error;
    }
  }

  // Get sports trending news (category_type=sport, category=trending) for sports news headlines
  async getLatestTrendingSportsNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending sports news with category_type=sport, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'sport',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Latest trending sports news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary latest trending sports news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'sport',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative latest trending sports news endpoint response:', response.data);
      }
      
      console.log('Latest trending sports news response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.error('Unexpected trending sports response structure:', response.data);
        return [];
      }

      // Additional client-side filtering to ensure we only get sports trending news
      const filteredArticles = articles.filter(article => 
        article.category_type?.toLowerCase() === 'sport' && 
        article.category?.toLowerCase() === 'trending'
      );

      console.log(`Found ${filteredArticles.length} trending sports articles after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending sports news:', error);
      throw error;
    }
  }

  // Get business trending news (category_type=business, category=trending) for business news headlines
  async getLatestTrendingBusinessNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending business news with category_type=business, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'business',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Latest trending business news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary latest trending business news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'business',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative latest trending business news endpoint response:', response.data);
      }
      
      console.log('Latest trending business news response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.warn('Unexpected response structure for business trending news:', response.data);
        articles = [];
      }
      
      console.log(`Found ${articles.length} business trending articles from API`);
      
      // Filter for business-related content
      const filteredArticles = articles.filter(article => {
        const categoryType = article.category_type?.toLowerCase();
        const category = article.category?.toLowerCase();
        const title = article.title?.toLowerCase() || '';
        const description = article.content?.toLowerCase() || '';
        
        // Check if it's business-related
        const isBusiness = categoryType === 'business' || 
                          category === 'business' || 
                          title.includes('business') ||
                          title.includes('economy') ||
                          title.includes('finance') ||
                          title.includes('market') ||
                          title.includes('stock') ||
                          title.includes('investment') ||
                          title.includes('company') ||
                          title.includes('corporate') ||
                          description.includes('business') ||
                          description.includes('economy') ||
                          description.includes('finance');
        
        const isTrending = category === 'trending' || category === 'business';
        
        return isBusiness && isTrending;
      });
      
      console.log(`Found ${filteredArticles.length} trending business articles after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending business news:', error);
      throw error;
    }
  }

  // Get education trending news (category_type=education, category=trending) for education news headlines
  async getLatestTrendingEducationNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending education news with category_type=education, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'education',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Latest trending education news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary latest trending education news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'education',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative latest trending education news endpoint response:', response.data);
      }
      
      console.log('Latest trending education news response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.warn('Unexpected response structure for education trending news:', response.data);
        articles = [];
      }
      
      console.log(`Found ${articles.length} education trending articles from API`);
      
      // Filter for education-related content
      const filteredArticles = articles.filter(article => {
        const categoryType = article.category_type?.toLowerCase();
        const category = article.category?.toLowerCase();
        const title = article.title?.toLowerCase() || '';
        const description = article.content?.toLowerCase() || '';
        
        // Check if it's education-related
        const isEducation = categoryType === 'education' || 
                           category === 'education' || 
                           title.includes('education') ||
                           title.includes('school') ||
                           title.includes('university') ||
                           title.includes('college') ||
                           title.includes('student') ||
                           title.includes('teacher') ||
                           title.includes('learning') ||
                           title.includes('academic') ||
                           title.includes('study') ||
                           title.includes('research') ||
                           description.includes('education') ||
                           description.includes('school') ||
                           description.includes('university') ||
                           description.includes('learning');
        
        const isTrending = category === 'trending' || category === 'education';
        
        return isEducation && isTrending;
      });
      
      console.log(`Found ${filteredArticles.length} trending education articles after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending education news:', error);
      throw error;
    }
  }

  // Get local trending news (category_type=local, category=trending) for local news headlines
  async getLatestTrendingLocalNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest trending local news with category_type=local, category=trending, limit:', limit);
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'local',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
      } catch (primaryError) {
        console.warn('Primary latest trending local news endpoint failed, trying alternative:', primaryError);
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'local',
            category: 'trending',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
      }
      let articles: BackendTrendingNewsResponse[] = [];
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.warn('Unexpected response structure for local trending news:', response.data);
        articles = [];
      }
      const filteredArticles = articles.filter(article => {
        const categoryType = article.category_type?.toLowerCase();
        const category = article.category?.toLowerCase();
        return categoryType === 'local' && category === 'trending';
      });
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching latest trending local news:', error);
      throw error;
    }
  }

  // Get local news excluding trending (category_type=local, category!=trending)
  async getLocalNewsExcludingTrending(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching local news excluding trending with category_type=local, category!=trending, limit:', limit);
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'local',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
      } catch (primaryError) {
        console.warn('Primary local news excluding trending endpoint failed, trying alternative:', primaryError);
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'local',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
      }
      let articles: BackendTrendingNewsResponse[] = [];
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.warn('Unexpected response structure for local news excluding trending:', response.data);
        articles = [];
      }
      const filteredArticles = articles.filter(article => {
        const categoryType = article.category_type?.toLowerCase();
        const category = article.category?.toLowerCase();
        const isLocal = categoryType === 'local' || category === 'local';
        const isNotTrending = category !== 'trending';
        return isLocal && isNotTrending;
      });
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching local news excluding trending:', error);
      throw error;
    }
  }
  // Get education news excluding trending (category_type=education, category!=trending) for education news headlines
  async getEducationNewsExcludingTrending(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching education news excluding trending with category_type=education, category!=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'education',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Education news excluding trending endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary education news excluding trending endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category_type: 'education',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative education news excluding trending endpoint response:', response.data);
      }
      
      console.log('Education news excluding trending response status:', response.status);
      
      // Handle different response structures
      let articles: BackendTrendingNewsResponse[] = [];
      
      if (response.data && response.data.articles) {
        articles = response.data.articles;
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = (response.data as any).trending_news;
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = response.data as BackendTrendingNewsResponse[];
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = (response.data as any).data as BackendTrendingNewsResponse[];
      } else {
        console.warn('Unexpected response structure for education news excluding trending:', response.data);
        articles = [];
      }
      
      console.log(`Found ${articles.length} education articles from API`);
      
      // Filter for education-related content and exclude trending
      const filteredArticles = articles.filter(article => {
        const categoryType = article.category_type?.toLowerCase();
        const category = article.category?.toLowerCase();
        const title = article.title?.toLowerCase() || '';
        const description = article.content?.toLowerCase() || '';
        
        // Check if it's education-related
        const isEducation = categoryType === 'education' || 
                           category === 'education' || 
                           title.includes('education') ||
                           title.includes('school') ||
                           title.includes('university') ||
                           title.includes('college') ||
                           title.includes('student') ||
                           title.includes('teacher') ||
                           title.includes('learning') ||
                           title.includes('academic') ||
                           title.includes('study') ||
                           title.includes('research') ||
                           description.includes('education') ||
                           description.includes('school') ||
                           description.includes('university') ||
                           description.includes('learning');
        
        // Exclude trending category
        const isNotTrending = category !== 'trending';
        
        return isEducation && isNotTrending;
      });
      
      console.log(`Found ${filteredArticles.length} education articles excluding trending after filtering`);
      
      return this.transformBackendResponse(filteredArticles);
    } catch (error) {
      console.error('Error fetching education news excluding trending:', error);
      throw error;
    }
  }

  // Get national news articles (source=national, category not in trending/popular) for news article section
  async getNationalNewsArticles(limit: number = 10, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching national news articles with source=national, category not in trending/popular, limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('National news articles endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary national news articles endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative national news articles endpoint response:', response.data);
      }
      
      console.log('National news articles response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected national news articles response structure:', response.data);
        return [];
      }

      // Client-side filtering to exclude trending and popular categories
      const filteredArticles = articles.filter(article => {
        const category = article.category?.toLowerCase();
        const isNotTrending = category !== 'trending';
        const isNotPopular = category !== 'popular';
        const isNational = article.source?.toLowerCase() === 'national';
        
        console.log(`Article "${article.title}" - category: ${category}, source: ${article.source}, isNational: ${isNational}, isNotTrending: ${isNotTrending}, isNotPopular: ${isNotPopular}`);
        
        return isNational && isNotTrending && isNotPopular;
      });

      console.log(`Filtered ${filteredArticles.length} national news articles from ${articles.length} total articles`);
      return filteredArticles;
    } catch (error) {
      console.error('Error fetching national news articles:', error);
      throw error;
    }
  }

  // Get latest national news for carousel (source=national, category=trending) with S3 images/videos
  async getLatestNationalNewsForCarousel(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest national news for carousel with source=national, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Latest national news carousel endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary latest national news carousel endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative latest national news carousel endpoint response:', response.data);
      }
      
      console.log('Latest national news carousel response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected latest national news carousel response structure:', response.data);
        return [];
      }
      
      // Sort by published_date to ensure most recent comes first
      const sortedArticles = articles.sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || new Date());
        const dateB = new Date(b.published_at || b.created_at || new Date());
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('Transformed latest national news carousel articles:', sortedArticles);
      return sortedArticles;
    } catch (error) {
      console.error('Error fetching latest national news for carousel:', error);
      throw error;
    }
  }

  // Get latest world news for carousel (source=world, category=trending) with S3 images/videos
  async getLatestWorldNewsForCarousel(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching latest world news for carousel with source=world, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',       // Exact match: source='world'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Latest world news carousel endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary latest world news carousel endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'world',       // Exact match: source='world'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative latest world news carousel endpoint response:', response.data);
      }
      
      console.log('Latest world news carousel response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected latest world news carousel response structure:', response.data);
        return [];
      }
      
      // Sort by published_date to ensure most recent comes first
      const sortedArticles = articles.sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || new Date());
        const dateB = new Date(b.published_at || b.created_at || new Date());
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('Transformed latest world news carousel articles:', sortedArticles);
      return sortedArticles;
    } catch (error) {
      console.error('Error fetching latest world news for carousel:', error);
      throw error;
    }
  }

  // Get trending national news for carousel (source=national, category=trending) with S3 images/videos
  async getTrendingNationalNewsForCarousel(limit: number = 5): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching trending national news for carousel with source=national, category=trending, limit:', limit);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Trending national news carousel endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary trending national news carousel endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            source: 'national',    // Exact match: source='national'
            category: 'trending',  // Exact match: category='trending'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative trending national news carousel endpoint response:', response.data);
      }
      
      console.log('Trending national news carousel response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected trending national news carousel response structure:', response.data);
        return [];
      }
      
      console.log('Transformed trending national news carousel articles:', articles);
      return articles;
    } catch (error) {
      console.error('Error fetching trending national news for carousel:', error);
      throw error;
    }
  }

  // Get popular national news articles (source=national, category=popular) for right sidebar section
  async getPopularNationalNewsArticles(limit: number = 6, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching popular national news articles with source=national, category=popular, limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            category: 'popular',   // Exact match: category='popular'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Popular national news articles endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary popular national news articles endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            category: 'popular',   // Exact match: category='popular'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative popular national news articles endpoint response:', response.data);
      }
      
      console.log('Popular national news articles response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected popular national news articles response structure:', response.data);
        return [];
      }

      // Client-side filtering to ensure only popular national articles
      const filteredArticles = articles.filter(article => {
        const category = article.category?.toLowerCase();
        const source = article.source?.toLowerCase();
        const isPopular = category === 'popular';
        const isNational = source === 'national';
        
        console.log(`Popular Article "${article.title}" - category: ${category}, source: ${source}, isPopular: ${isPopular}, isNational: ${isNational}`);
        
        return isNational && isPopular;
      });

      console.log(`Filtered ${filteredArticles.length} popular national news articles from ${articles.length} total articles`);
      return filteredArticles;
    } catch (error) {
      console.error('Error fetching popular national news articles:', error);
      throw error;
    }
  }

  // Get popular national news from trending_news table with exact query: category='popular' and source='national'
  async getPopularNationalNews(limit: number = 10): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching popular national news with exact query: category=popular, source=national, limit:', limit);
      
      // Try the primary endpoint first with exact query parameters
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'popular',  // Exact match: category='popular'
            source: 'national',   // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Popular national news endpoint response (category=popular, source=national):', response.data);
      } catch (primaryError) {
        console.warn('Primary popular national news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint with same exact parameters
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            category: 'popular',  // Exact match: category='popular'
            source: 'national',   // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative popular national news endpoint response (category=popular, source=national):', response.data);
      }
      
      console.log('Popular national news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const popularNationalNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return popularNationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const popularNationalNews = this.transformBackendResponse((response.data as any).trending_news);
        return popularNationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const popularNationalNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return popularNationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected popular national news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching popular national news from trending table:', error);
      throw error;
    }
  }

  // Get national news excluding trending category (source=national, category!=trending) for featured stories
  async getNationalNewsExcludingTrending(limit: number = 20, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching national news excluding trending category with source=national, category!=trending, limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('National news excluding trending endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary national news excluding trending endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',    // Exact match: source='national'
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('Alternative national news excluding trending endpoint response:', response.data);
      }
      
      console.log('National news excluding trending response status:', response.status);
      
      let articles: TrendingNewsResponse[] = [];
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        articles = this.transformBackendResponse(response.data.articles);
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        articles = this.transformBackendResponse((response.data as any).trending_news);
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        articles = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
        // Handle nested data structure
        articles = this.transformBackendResponse((response.data as any).data as BackendTrendingNewsResponse[]);
      } else {
        console.error('Unexpected national news excluding trending response structure:', response.data);
        return [];
      }

      // Client-side filtering to exclude only trending category
      const filteredArticles = articles.filter(article => {
        const category = article.category?.toLowerCase();
        const source = article.source?.toLowerCase();
        const isNotTrending = category !== 'trending';
        const isNational = source === 'national';
        
        console.log(`Article "${article.title}" - category: ${category}, source: ${source}, isNational: ${isNational}, isNotTrending: ${isNotTrending}`);
        
        return isNational && isNotTrending;
      });

      console.log(`Filtered ${filteredArticles.length} national news articles (excluding trending) from ${articles.length} total articles`);
      return filteredArticles;
    } catch (error) {
      console.error('Error fetching national news excluding trending:', error);
      throw error;
    }
  }

  // Get national news from trending_news table with source=national and category not in trending/popular
  async getNationalNewsFromTrending(limit: number = 20, offset: number = 0): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching national news from trending_news table with limit:', limit, 'offset:', offset);
      
      // Try the primary endpoint first - use get_db_s3_trending_news with exclusions
      let response;
      try {
        response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
          params: { 
            limit,
            offset,
            source: 'national',
            exclude_categories: 'trending,popular',
            order_by: 'published_date',
            order_direction: 'desc'
          }
        });
        console.log('National news endpoint response (get_db_s3_trending_news):', response.data);
      } catch (primaryError) {
        console.warn('Primary national news endpoint failed, trying alternative:', primaryError);
        // Try alternative endpoint
        try {
          response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_trending_news', {
            params: { 
              limit,
              offset,
              source: 'national',
              exclude_categories: 'trending,popular',
              order_by: 'published_date',
              order_direction: 'desc'
            }
          });
          console.log('Alternative national news endpoint response (get_db_s3_trending_news):', response.data);
        } catch (alternativeError) {
          console.warn('Alternative national news endpoint failed, trying breaking_news endpoint:', alternativeError);
          // Fallback to breaking_news endpoint with filters
          response = await apiClient.get<BackendTrendingNewsList>('/news/get_db_s3_breaking_news', {
            params: { 
              limit,
              offset,
              source: 'national',
              exclude_categories: 'trending,popular',
              order_by: 'published_date',
              order_direction: 'desc'
            }
          });
          console.log('Fallback breaking_news endpoint response:', response.data);
        }
      }
      
      console.log('National news response status:', response.status);
      
      // Handle different response structures
      if (response.data && response.data.articles) {
        const nationalNews = this.transformBackendResponse(response.data.articles);
        // Sort by published_date to ensure most recent comes first
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (response.data && (response.data as any).trending_news) {
        // Fallback for old structure
        const nationalNews = this.transformBackendResponse((response.data as any).trending_news);
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else if (Array.isArray(response.data)) {
        // If the response is directly an array
        const nationalNews = this.transformBackendResponse(response.data as BackendTrendingNewsResponse[]);
        return nationalNews.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        console.error('Unexpected national news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching national news from trending table:', error);
      throw error;
    }
  }

}

// Create service instance
export const trendingApiService = new TrendingApiService();

// Cached versions of frequently used methods
export const cachedTrendingApi = {
  getLatestTrendingNews: withCache(
    trendingApiService.getLatestTrendingNews.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `latest_trending_news_${limit}`
  ),

  getLatestTrendingNationalNews: withCache(
    trendingApiService.getLatestTrendingNationalNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending national news
    (limit) => `latest_trending_national_news_${limit}`
  ),

  getWorldTrendingNews: withCache(
    trendingApiService.getWorldTrendingNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending world news
    (limit) => `world_trending_news_${limit}`
  ),

  getTopTrendingNews: withCache(
    trendingApiService.getTopTrendingNews.bind(trendingApiService),
    3 * 60 * 1000, // 3 minutes cache
    (limit) => `top_trending_news_${limit}`
  ),

  getTrendingCategories: withCache(
    trendingApiService.getTrendingCategories.bind(trendingApiService),
    30 * 60 * 1000, // 30 minutes cache
    () => 'trending_categories'
  ),

  getTrendingNews: withCache(
    trendingApiService.getTrendingNews.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache
    (page, size) => `trending_news_${page}_${size}`
  ),

  getTestTrendingNews: withCache(
    trendingApiService.getTestTrendingNews.bind(trendingApiService),
    5 * 60 * 1000, // 5 minutes cache for test data
    (limit) => `test_trending_news_${limit}`
  ),

  getBreakingNewsFromTrending: withCache(
    trendingApiService.getBreakingNewsFromTrending.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for breaking news
    (limit) => `breaking_news_trending_${limit}`
  ),

  getAllBreakingNewsFromTrending: withCache(
    trendingApiService.getAllBreakingNewsFromTrending.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for all breaking news
    (limit) => `all_breaking_news_trending_${limit}`
  ),

  getRemainingBreakingNewsForLatest: withCache(
    trendingApiService.getRemainingBreakingNewsForLatest.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for remaining breaking news
    (excludeCount, limit) => `remaining_breaking_news_${excludeCount}_${limit}`
  ),

  getPopularNewsFromTrending: withCache(
    trendingApiService.getPopularNewsFromTrending.bind(trendingApiService),
    5 * 60 * 1000, // 5 minutes cache for popular news (less frequent updates)
    (limit) => `popular_news_trending_${limit}`
  ),

  getTrendingNewsByCategory: withCache(
    trendingApiService.getTrendingNewsByCategory.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for category-specific trending news
    (category, page, size) => `trending_news_list_category_${category}_${page}_${size}`
  ),

  getNationalNewsFromTrending: withCache(
    trendingApiService.getNationalNewsFromTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for national news
    (limit, offset) => `national_news_trending_${limit}_${offset}`
  ),

  getNationalTrendingNews: withCache(
    trendingApiService.getNationalTrendingNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for national trending news (more frequent updates)
    (limit) => `national_trending_news_${limit}`
  ),

  getPopularNationalNews: withCache(
    trendingApiService.getPopularNationalNews.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for popular national news
    (limit) => `popular_national_news_${limit}`
  ),

  getNationalNewsArticles: withCache(
    trendingApiService.getNationalNewsArticles.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for national news articles
    (limit, offset) => `national_news_articles_${limit}_${offset}`
  ),

  getLatestNationalNewsForCarousel: withCache(
    trendingApiService.getLatestNationalNewsForCarousel.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for latest national news carousel
    (limit) => `latest_national_news_carousel_${limit}`
  ),

  getLatestWorldNewsForCarousel: withCache(
    trendingApiService.getLatestWorldNewsForCarousel.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for latest world news carousel
    (limit) => `latest_world_news_carousel_${limit}`
  ),

  getTrendingNationalNewsForCarousel: withCache(
    trendingApiService.getTrendingNationalNewsForCarousel.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending national news carousel
    (limit) => `trending_national_news_carousel_${limit}`
  ),

  getPopularNationalNewsArticles: withCache(
    trendingApiService.getPopularNationalNewsArticles.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for popular national news articles
    (limit, offset) => `popular_national_news_articles_${limit}_${offset}`
  ),

  getNationalNewsExcludingTrending: withCache(
    trendingApiService.getNationalNewsExcludingTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for national news excluding trending
    (limit, offset) => `national_news_excluding_trending_${limit}_${offset}`
  ),

  getLatestTrendingWorldNews: withCache(
    trendingApiService.getLatestTrendingWorldNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending world news
    (limit) => `latest_trending_world_news_${limit}`
  ),

  getLatestTrendingSportsNews: withCache(
    trendingApiService.getLatestTrendingSportsNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending sports news
    (limit) => `latest_trending_sports_news_${limit}`
  ),

  getLatestTrendingBusinessNews: withCache(
    trendingApiService.getLatestTrendingBusinessNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending business news
    (limit) => `latest_trending_business_news_${limit}`
  ),

  getLatestTrendingEducationNews: withCache(
    trendingApiService.getLatestTrendingEducationNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending education news
    (limit) => `latest_trending_education_news_${limit}`
  ),

  getEducationNewsExcludingTrending: withCache(
    trendingApiService.getEducationNewsExcludingTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for education news excluding trending
    (limit) => `education_news_excluding_trending_${limit}`
  ),

  getWorldNewsExcludingTrending: withCache(
    trendingApiService.getWorldNewsExcludingTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for world news excluding trending
    (limit, offset) => `world_news_excluding_trending_${limit}_${offset}`
  ),

  getSportsNewsExcludingTrending: withCache(
    trendingApiService.getSportsNewsExcludingTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for sports news excluding trending
    (limit, offset) => `sports_news_excluding_trending_${limit}_${offset}`
  ),

  getLatestTrendingLocalNews: withCache(
    trendingApiService.getLatestTrendingLocalNews.bind(trendingApiService),
    1 * 60 * 1000, // 1 minute cache for trending local news
    (limit) => `latest_trending_local_news_${limit}`
  ),

  getLocalNewsExcludingTrending: withCache(
    trendingApiService.getLocalNewsExcludingTrending.bind(trendingApiService),
    2 * 60 * 1000, // 2 minutes cache for local news excluding trending
    (limit) => `local_news_excluding_trending_${limit}`
  ),

};

// Legacy functions for backward compatibility
export const fetchTrendingNews = cachedTrendingApi.getLatestTrendingNews;
export const fetchTopTrending = cachedTrendingApi.getTopTrendingNews;
export const fetchTrendingCategories = cachedTrendingApi.getTrendingCategories;

