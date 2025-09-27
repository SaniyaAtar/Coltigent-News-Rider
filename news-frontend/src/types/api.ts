// API Types and Interfaces
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  content?: string;
  image?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  author?: string;
  source?: string;
  url?: string;
  is_breaking?: boolean;
  is_trending?: boolean;
  views_count?: number;
  likes_count?: number;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NewsFilters {
  page?: number;
  size?: number;
  published_only?: boolean;
  category?: string;
  search?: string;
  is_breaking?: boolean;
  is_trending?: boolean;
  author?: string;
  date_from?: string;
  date_to?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface TrendingItem {
  id: number;
  hashtag: string;
  tweets_count: number;
  category?: string;
}

export interface TrendingNewsResponse {
  id: number;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  category_type?: string;
  author?: string;
  source?: string;
  read_more_url?: string;
  is_breaking?: boolean;
  is_trending?: boolean;
  views_count?: number;
  likes_count?: number;
  tags?: string[];
  trending_score?: number;
  trending_rank?: number;
  is_live?: boolean;
  last_updated?: string;
}

export interface TrendingCategoriesResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  trending_count?: number;
}

export interface TrendingRefreshResponse {
  message: string;
  refreshed_count: number;
  timestamp: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_active?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface VideoNews {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  published_at?: string;
  category?: string;
  views_count?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// Feed Files API Types
export interface FeedFilesResponse {
  national_latest: {
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  };
  world_latest: {
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  };
  total_articles: number;
  last_updated: string;
}

export interface CategoryNewsRequest {
  category: 'politics' | 'education' | 'business' | 'local' | 'sports';
  source: 'national' | 'world';
  limit?: number;
  exclude_ids?: number[];
}

