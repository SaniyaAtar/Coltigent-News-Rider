import { apiClient } from './apiClient';
import { withCache } from './cache';
import { trendingApiService } from './trendingApi';
import { feedFilesApiService } from './feedFilesApi';
import type {
  NewsItem,
  PaginatedResponse,
  NewsFilters,
  TrendingItem,
  Category,
  VideoNews,
  TrendingNewsResponse,
  FeedFilesResponse,
  CategoryNewsRequest,
} from '../types/api';

// News API Service
export class NewsApiService {
  private readonly baseUrl = '/news';

  // Get all news with pagination and filters
  async getNews(filters: NewsFilters = {}): Promise<PaginatedResponse<NewsItem>> {
    const params = {
      page: filters.page || 1,
      size: filters.size || 10,
      published_only: filters.published_only ?? true,
      ...(filters.category && { category: filters.category }),
      ...(filters.search && { search: filters.search }),
      ...(filters.is_breaking && { is_breaking: filters.is_breaking }),
      ...(filters.is_trending && { is_trending: filters.is_trending }),
      ...(filters.author && { author: filters.author }),
      ...(filters.date_from && { date_from: filters.date_from }),
      ...(filters.date_to && { date_to: filters.date_to }),
    };

    const response = await apiClient.get<PaginatedResponse<NewsItem>>(this.baseUrl, { params });
    return response.data;
  }

  // Get single news item by ID
  async getNewsById(id: number): Promise<NewsItem> {
    const response = await apiClient.get<NewsItem>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Get breaking news
  async getBreakingNews(limit: number = 5): Promise<NewsItem[]> {
    const response = await apiClient.get<PaginatedResponse<NewsItem>>(this.baseUrl, {
      params: {
        is_breaking: true,
        published_only: true,
        size: limit,
        page: 1,
      },
    });
    return response.data.results;
  }

  // Get breaking news from trending_news table with category=breaking
  async getBreakingNewsFromTrending(limit: number = 3): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getBreakingNewsFromTrending(limit);
  }

  // Get all breaking news from trending_news table with category=breaking
  async getAllBreakingNewsFromTrending(limit: number = 20): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getAllBreakingNewsFromTrending(limit);
  }

  // Get remaining breaking news (excluding top 3) for latest section
  async getRemainingBreakingNewsForLatest(excludeCount: number = 3, limit: number = 10): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getRemainingBreakingNewsForLatest(excludeCount, limit);
  }

  // Get popular news from trending_news table with category=popular
  async getPopularNewsFromTrending(limit: number = 20): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getPopularNewsFromTrending(limit);
  }

  // Get trending news (using new trending API)
  async getTrendingNews(limit: number = 10): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getLatestTrendingNews(limit);
  }

  // Get trending news with pagination (using new trending API)
  async getTrendingNewsPaginated(page: number = 1, size: number = 10): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getTrendingNews(page, size);
  }

  // Get top trending news by score
  async getTopTrendingNews(limit: number = 5): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getTopTrendingNews(limit);
  }

  // Get trending news by category
  async getTrendingNewsByCategory(category: string, limit: number = 10): Promise<TrendingNewsResponse[]> {
    return await trendingApiService.getTrendingNewsByCategory(category, 1, limit);
  }

  // Manual refresh of trending news
  async refreshTrendingNews(): Promise<void> {
    await trendingApiService.refreshTrendingNews();
  }

  // Get news by category
  async getNewsByCategory(category: string, limit: number = 10): Promise<NewsItem[]> {
    const response = await apiClient.get<PaginatedResponse<NewsItem>>(this.baseUrl, {
      params: {
        category,
        published_only: true,
        size: limit,
        page: 1,
      },
    });
    return response.data.results;
  }

  // Search news
  async searchNews(query: string, limit: number = 10): Promise<NewsItem[]> {
    const response = await apiClient.get<PaginatedResponse<NewsItem>>(this.baseUrl, {
      params: {
        search: query,
        published_only: true,
        size: limit,
        page: 1,
      },
    });
    return response.data.results;
  }

  // Get latest news
  async getLatestNews(limit: number = 10): Promise<NewsItem[]> {
    const response = await apiClient.get<PaginatedResponse<NewsItem>>(this.baseUrl, {
      params: {
        published_only: true,
        size: limit,
        page: 1,
        ordering: '-published_at',
      },
    });
    return response.data.results;
  }

  // Increment view count
  async incrementViewCount(id: number): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/view`);
  }

  // Get trending hashtags
  async getTrendingHashtags(limit: number = 10): Promise<TrendingItem[]> {
    const response = await apiClient.get<TrendingItem[]>('/trending', {
      params: { limit },
    });
    return response.data;
  }

  // Get trending categories (using new trending API)
  async getTrendingCategories(): Promise<string[]> {
    return await trendingApiService.getTrendingCategories();
  }

  // Get categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  }

  // Get video news
  async getVideoNews(limit: number = 10): Promise<VideoNews[]> {
    const response = await apiClient.get<PaginatedResponse<VideoNews>>('/videos', {
      params: {
        size: limit,
        page: 1,
      },
    });
    return response.data.results;
  }

  // Get single video news
  async getVideoNewsById(id: number): Promise<VideoNews> {
    const response = await apiClient.get<VideoNews>(`/videos/${id}`);
    return response.data;
  }

  // Feed Files API Methods
  async fetchFeedFiles(): Promise<FeedFilesResponse> {
    return await feedFilesApiService.fetchFeedFiles();
  }

  async getNationalLatestNews(limit: number = 5): Promise<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  }> {
    return await feedFilesApiService.getNationalLatestNews(limit);
  }

  async getWorldLatestNews(limit: number = 5): Promise<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  }> {
    return await feedFilesApiService.getWorldLatestNews(limit);
  }

  async getLatestNewsByCategory(
    category: 'politics' | 'education' | 'business' | 'local' | 'sports',
    source: 'national' | 'world' = 'national',
    limit: number = 10
  ): Promise<TrendingNewsResponse[]> {
    return await feedFilesApiService.getLatestNewsByCategory(category, source, limit);
  }

  async fetchNewsByCategory(request: CategoryNewsRequest): Promise<TrendingNewsResponse[]> {
    return await feedFilesApiService.fetchNewsByCategory(request);
  }
}

// Create service instance
export const newsApiService = new NewsApiService();

// Cached versions of frequently used methods
export const cachedNewsApi = {
  getBreakingNews: withCache(
    newsApiService.getBreakingNews.bind(newsApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `breaking_news_${limit}`
  ),

  getBreakingNewsFromTrending: withCache(
    newsApiService.getBreakingNewsFromTrending.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache for breaking news
    (limit) => `breaking_news_trending_${limit}`
  ),

  getAllBreakingNewsFromTrending: withCache(
    newsApiService.getAllBreakingNewsFromTrending.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache for all breaking news
    (limit) => `all_breaking_news_trending_${limit}`
  ),

  getRemainingBreakingNewsForLatest: withCache(
    newsApiService.getRemainingBreakingNewsForLatest.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache for remaining breaking news
    (excludeCount, limit) => `remaining_breaking_news_${excludeCount}_${limit}`
  ),

  getPopularNewsFromTrending: withCache(
    newsApiService.getPopularNewsFromTrending.bind(newsApiService),
    5 * 60 * 1000, // 5 minutes cache for popular news
    (limit) => `popular_news_trending_${limit}`
  ),
  
  getTrendingNews: withCache(
    newsApiService.getTrendingNews.bind(newsApiService),
    2 * 60 * 1000, // 2 minutes cache (using new trending API)
    (limit) => `trending_news_${limit}`
  ),
  
  getTopTrendingNews: withCache(
    newsApiService.getTopTrendingNews.bind(newsApiService),
    3 * 60 * 1000, // 3 minutes cache
    (limit) => `top_trending_news_${limit}`
  ),
  
  getLatestNews: withCache(
    newsApiService.getLatestNews.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache
    (limit) => `latest_news_${limit}`
  ),
  
  getCategories: withCache(
    newsApiService.getCategories.bind(newsApiService),
    30 * 60 * 1000, // 30 minutes cache
    () => 'categories'
  ),
  
  getTrendingCategories: withCache(
    newsApiService.getTrendingCategories.bind(newsApiService),
    30 * 60 * 1000, // 30 minutes cache
    () => 'trending_categories'
  ),
  
  getTrendingHashtags: withCache(
    newsApiService.getTrendingHashtags.bind(newsApiService),
    10 * 60 * 1000, // 10 minutes cache
    (limit) => `trending_hashtags_${limit}`
  ),

  // Feed Files API cached methods
  fetchFeedFiles: withCache(
    newsApiService.fetchFeedFiles.bind(newsApiService),
    2 * 60 * 1000, // 2 minutes cache
    () => 'feed_files_all'
  ),

  getNationalLatestNews: withCache(
    newsApiService.getNationalLatestNews.bind(newsApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `national_latest_news_${limit}`
  ),

  getWorldLatestNews: withCache(
    newsApiService.getWorldLatestNews.bind(newsApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `world_latest_news_${limit}`
  ),

  getLatestNewsByCategory: withCache(
    newsApiService.getLatestNewsByCategory.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache for category-specific news
    (category, source, limit) => `latest_news_${category}_${source}_${limit}`
  ),

  fetchNewsByCategory: withCache(
    newsApiService.fetchNewsByCategory.bind(newsApiService),
    1 * 60 * 1000, // 1 minute cache
    (request) => `news_by_category_${request.category}_${request.source}_${request.limit || 10}`
  ),
};

// Legacy functions for backward compatibility
export const fetchBreakingNews = cachedNewsApi.getBreakingNews;
export const fetchTrending = cachedNewsApi.getTrendingNews;
export const fetchLatest = cachedNewsApi.getLatestNews;

// New trending API functions
export const fetchTopTrending = cachedNewsApi.getTopTrendingNews;
export const fetchTrendingCategories = cachedNewsApi.getTrendingCategories;

// Feed Files API functions
export const fetchFeedFiles = cachedNewsApi.fetchFeedFiles;
export const fetchNationalLatestNews = cachedNewsApi.getNationalLatestNews;
export const fetchWorldLatestNews = cachedNewsApi.getWorldLatestNews;
export const fetchLatestNewsByCategory = cachedNewsApi.getLatestNewsByCategory;
export const fetchNewsByCategory = cachedNewsApi.fetchNewsByCategory;