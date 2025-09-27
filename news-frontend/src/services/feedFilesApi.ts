import { apiClient } from './apiClient';
import { withCache } from './cache';
import type {
  TrendingNewsResponse,
  FeedFilesResponse,
  CategoryNewsRequest,
} from '../types/api';

// Backend API response interfaces for feed files
interface BackendFeedFilesResponse {
  articles: BackendTrendingNewsResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface BackendTrendingNewsResponse {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category: string;
  category_type: string;
  source: string;
  source_url: string;
  published_date?: string;
  main_image_url?: string;
  main_image_s3_url?: string;
  created_at: string;
  updated_at?: string;
  trending_score?: number;
}

// Feed Files API Service
export class FeedFilesApiService {
  // Removed unused baseUrl property

  // Helper function to determine if news is India-related (national) or world
  private isIndiaRelatedNews(title: string, content: string, source: string): boolean {
    const indiaKeywords = [
      'india', 'indian', 'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
      'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane',
      'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ludhiana', 'agra',
      'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi',
      'srinagar', 'aurangabad', 'noida', 'howrah', 'ranchi', 'gwalior', 'jabalpur',
      'coimbatore', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh',
      'guwahati', 'solapur', 'hubli', 'tiruchirappalli', 'bareilly', 'mysore', 'tiruppur',
      'gurgaon', 'aligarh', 'jalandhar', 'bhubaneswar', 'salem', 'warangal', 'guntur',
      'bhiwandi', 'amravati', 'nanded', 'kolhapur', 'sangli', 'malegaon', 'ulhasnagar',
      'jalgaon', 'latur', 'ahmednagar', 'chandrapur', 'parbhani', 'ichalkaranji',
      'jammu', 'shimla', 'dehradun', 'srinagar', 'leh', 'gangtok', 'itanagar',
      'kohima', 'aizawl', 'imphal', 'agartala', 'shillong', 'dispur', 'patna',
      'raipur', 'bhubaneswar', 'ranchi', 'kolkata', 'bhubaneswar', 'cuttack',
      'berhampur', 'rourkela', 'sambalpur', 'puri', 'baleshwar', 'baripada',
      'bhadrak', 'balangir', 'bargarh', 'dhenkanal', 'jagatsinghpur', 'jajpur',
      'kendrapara', 'keonjhar', 'khordha', 'koraput', 'malkangiri', 'mayurbhanj',
      'nabarangpur', 'nuapada', 'rayagada', 'sundargarh', 'anjaw', 'changlang',
      'dibang valley', 'east kameng', 'east siang', 'kurung kumey', 'lohit',
      'longding', 'lower dibang valley', 'lower subansiri', 'papum pare',
      'tawang', 'tirap', 'upper siang', 'upper subansiri', 'west kameng',
      'west siang', 'baksa', 'barpeta', 'bongaigaon', 'cachar', 'chirang',
      'darrang', 'dhemaji', 'dhubri', 'dibrugarh', 'goalpara', 'golaghat',
      'hailakandi', 'jorhat', 'kamrup', 'karbi anglong', 'karimganj', 'kokrajhar',
      'lakhimpur', 'marigaon', 'nagaon', 'nalbari', 'sivasagar', 'sonitpur',
      'tinsukia', 'udalguri', 'west karbi anglong', 'araria', 'arwal', 'aurangabad',
      'banka', 'begusarai', 'bhagalpur', 'bhojpur', 'buxar', 'darbhanga', 'east champaran',
      'gaya', 'gopalganj', 'jamui', 'jehanabad', 'kaimur', 'katihar', 'khagaria',
      'kishanganj', 'lakhisarai', 'madhepura', 'madhubani', 'munger', 'muzaffarpur',
      'nalanda', 'nawada', 'pashchim champaran', 'patna', 'purnia', 'rohtas',
      'saharsa', 'saran', 'sheikhpura', 'sheohar', 'sitamarhi', 'siwan', 'supaul',
      'vaishali', 'west champaran', 'balod', 'baloda bazar', 'balrampur', 'bastar',
      'bemetara', 'bijapur', 'bilaspur', 'dantewada', 'dhamtari', 'durg', 'gariyaband',
      'janjgir-champa', 'jashpur', 'kabirdham', 'kanker', 'kondagaon', 'korba',
      'koriya', 'mahasamund', 'mungeli', 'narayanpur', 'raigarh', 'raipur', 'rajnandgaon',
      'sukma', 'surajpur', 'surguja', 'bokaro', 'chatra', 'deoghar', 'dhanbad',
      'dumka', 'east singhbhum', 'garhwa', 'giridih', 'godda', 'gumla', 'hazaribagh',
      'jamtara', 'khunti', 'koderma', 'latehar', 'lohardaga', 'pakur', 'palamu',
      'ramgarh', 'ranchi', 'sahibganj', 'saraikela kharsawan', 'simdega', 'west singhbhum',
      'bagalkot', 'ballari', 'belagavi', 'bengaluru rural', 'bengaluru urban', 'bidar',
      'chamarajanagar', 'chikballapur', 'chikkamagaluru', 'chitradurga', 'dakshina kannada',
      'davangere', 'dharwad', 'gadag', 'hassan', 'haveri', 'kalaburagi', 'kodagu',
      'kolar', 'koppal', 'mandya', 'mysuru', 'raichur', 'ramanagara', 'shivamogga',
      'tumakuru', 'udupi', 'uttara kannada', 'vijayapura', 'yadgir', 'alappuzha',
      'ernakulam', 'idukki', 'kannur', 'kasaragod', 'kollam', 'kottayam', 'kozhikode',
      'malappuram', 'palakkad', 'pathanamthitta', 'thiruvananthapuram', 'thrissur',
      'wayanad', 'agra', 'aligarh', 'allahabad', 'ambedkar nagar', 'amethi', 'amroha',
      'auraiya', 'azamgarh', 'baghpat', 'bahraich', 'ballia', 'balrampur', 'banda',
      'barabanki', 'bareilly', 'basti', 'bhadohi', 'bijnor', 'budaun', 'bulandshahr',
      'chandauli', 'chitrakoot', 'deoria', 'etah', 'etawah', 'faizabad', 'farrukhabad',
      'fatehpur', 'firozabad', 'gautam buddha nagar', 'ghaziabad', 'ghazipur', 'gonda',
      'gorakhpur', 'hamirpur', 'hapur', 'hardoi', 'hathras', 'jalaun', 'jaunpur',
      'jhansi', 'kannauj', 'kanpur dehat', 'kanpur nagar', 'kanshiram nagar', 'kaushambi',
      'kheri', 'kushinagar', 'lalitpur', 'lucknow', 'maharajganj', 'mahoba', 'mainpuri',
      'mathura', 'mau', 'meerut', 'mirzapur', 'moradabad', 'muzaffarnagar', 'pilibhit',
      'pratapgarh', 'raebareli', 'rampur', 'saharanpur', 'sambhal', 'sant kabir nagar',
      'shahjahanpur', 'shamli', 'shravasti', 'siddharthnagar', 'sitapur', 'sonbhadra',
      'sultanpur', 'unnao', 'varanasi', 'alipurduar', 'bankura', 'birbhum', 'cooch behar',
      'dakshin dinajpur', 'darjeeling', 'hooghly', 'howrah', 'jalpaiguri', 'jhargram',
      'kalimpong', 'kolkata', 'malda', 'murshidabad', 'nadia', 'north 24 parganas',
      'paschim bardhaman', 'paschim medinipur', 'purba bardhaman', 'purba medinipur',
      'purulia', 'south 24 parganas', 'uttar dinajpur', 'andaman and nicobar islands',
      'chandigarh', 'dadra and nagar haveli', 'daman and diu', 'delhi', 'lakshadweep',
      'puducherry', 'jammu and kashmir', 'ladakh'
    ];

    const text = `${title} ${content} ${source}`.toLowerCase();
    return indiaKeywords.some(keyword => text.includes(keyword));
  }

  // Helper function to map category types to standardized categories
  private mapCategoryType(categoryType: string): string {
    const categoryMapping: { [key: string]: string } = {
      'politics': 'politics',
      'political': 'politics',
      'government': 'politics',
      'election': 'politics',
      'parliament': 'politics',
      'education': 'education',
      'educational': 'education',
      'school': 'education',
      'university': 'education',
      'college': 'education',
      'student': 'education',
      'business': 'business',
      'economy': 'business',
      'economic': 'business',
      'finance': 'business',
      'financial': 'business',
      'market': 'business',
      'corporate': 'business',
      'local': 'local',
      'regional': 'local',
      'city': 'local',
      'municipal': 'local',
      'sports': 'sports',
      'sport': 'sports',
      'cricket': 'sports',
      'football': 'sports',
      'hockey': 'sports',
      'tennis': 'sports',
      'badminton': 'sports',
      'athletics': 'sports',
      'olympics': 'sports',
      'world': 'world',
      'global': 'world',
      'breaking': 'breaking',
      'trending': 'trending',
      'popular': 'popular'
    };

    return categoryMapping[categoryType.toLowerCase()] || 'general';
  }

  // Transform backend response to frontend format with proper source and category mapping
  private transformBackendResponse(
    backendNews: BackendTrendingNewsResponse[],
    excludeIds: number[] = []
  ): TrendingNewsResponse[] {
    return backendNews
      .filter(item => !excludeIds.includes(item.id)) // Remove duplicates
      .map((item, index) => {
        const isIndiaRelated = this.isIndiaRelatedNews(item.title, item.content, item.source);
        const mappedCategory = this.mapCategoryType(item.category_type || item.category);
        
        return {
          id: item.id,
          title: item.title || 'No title',
          description: item.summary || item.content || '',
          content: item.content || item.summary || '',
          image_url: item.main_image_s3_url || item.main_image_url,
          published_at: item.published_date,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category: mappedCategory,
          author: item.source || 'Unknown',
          source: isIndiaRelated ? 'national' : 'world', // Set source based on India-related content
          read_more_url: item.source_url,
          is_breaking: item.category === 'breaking' || item.category_type === 'breaking',
          is_trending: item.category === 'trending' || item.category_type === 'trending',
          trending_score: item.trending_score || 0,
          trending_rank: index + 1,
          is_live: true,
          last_updated: item.updated_at || item.created_at
        };
      });
  }

  // Fetch news by category and source
  async fetchNewsByCategory(request: CategoryNewsRequest): Promise<TrendingNewsResponse[]> {
    try {
      console.log('Fetching news by category:', request);
      
      const params = {
        limit: request.limit || 10,
        category: request.category,
        source: request.source,
        order_by: 'published_date',
        order_direction: 'desc',
        ...(request.exclude_ids && request.exclude_ids.length > 0 && { exclude_ids: request.exclude_ids.join(',') })
      };

      let response;
      try {
        response = await apiClient.get<BackendFeedFilesResponse>('/api/news/get_db_s3_trending_news', { params });
        console.log('Category news endpoint response:', response.data);
      } catch (primaryError) {
        console.warn('Primary category news endpoint failed, trying alternative:', primaryError);
        response = await apiClient.get<BackendFeedFilesResponse>('/news/get_db_s3_trending_news', { params });
        console.log('Alternative category news endpoint response:', response.data);
      }

      if (response.data && response.data.articles) {
        return this.transformBackendResponse(response.data.articles, request.exclude_ids);
      } else if (Array.isArray(response.data)) {
        return this.transformBackendResponse(response.data as BackendTrendingNewsResponse[], request.exclude_ids);
      } else {
        console.error('Unexpected category news response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching news by category:', error);
      throw error;
    }
  }

  // Main fetch_feed_files API function
  async fetchFeedFiles(): Promise<FeedFilesResponse> {
    try {
      console.log('Fetching feed files with all categories...');
      
      const categories: Array<'politics' | 'education' | 'business' | 'local' | 'sports'> = 
        ['politics', 'education', 'business', 'local', 'sports'];
      
      const sources: Array<'national' | 'world'> = ['national', 'world'];
      
      const allNews: TrendingNewsResponse[] = [];
      const excludeIds: number[] = [];

      // Fetch news for each category and source combination
      for (const source of sources) {
        for (const category of categories) {
          try {
            const categoryNews = await this.fetchNewsByCategory({
              category,
              source,
              limit: 5, // Get 5 articles per category per source
              exclude_ids: excludeIds
            });
            
            // Add to exclude list to prevent duplicates
            categoryNews.forEach(news => excludeIds.push(news.id));
            allNews.push(...categoryNews);
          } catch (error) {
            console.warn(`Failed to fetch ${source} ${category} news:`, error);
            // Continue with other categories even if one fails
          }
        }
      }

      // Organize news by source and category
      const nationalLatest = {
        politics: allNews.filter(news => news.source === 'national' && news.category === 'politics'),
        education: allNews.filter(news => news.source === 'national' && news.category === 'education'),
        business: allNews.filter(news => news.source === 'national' && news.category === 'business'),
        local: allNews.filter(news => news.source === 'national' && news.category === 'local'),
        sports: allNews.filter(news => news.source === 'national' && news.category === 'sports'),
      };

      const worldLatest = {
        politics: allNews.filter(news => news.source === 'world' && news.category === 'politics'),
        education: allNews.filter(news => news.source === 'world' && news.category === 'education'),
        business: allNews.filter(news => news.source === 'world' && news.category === 'business'),
        local: allNews.filter(news => news.source === 'world' && news.category === 'local'),
        sports: allNews.filter(news => news.source === 'world' && news.category === 'sports'),
      };

      return {
        national_latest: nationalLatest,
        world_latest: worldLatest,
        total_articles: allNews.length,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching feed files:', error);
      throw error;
    }
  }

  // Get latest news for a specific category (national or world)
  async getLatestNewsByCategory(
    category: 'politics' | 'education' | 'business' | 'local' | 'sports',
    source: 'national' | 'world' = 'national',
    limit: number = 10
  ): Promise<TrendingNewsResponse[]> {
    return this.fetchNewsByCategory({ category, source, limit });
  }

  // Get all national latest news across all categories
  async getNationalLatestNews(limit: number = 5): Promise<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  }> {
    const categories: Array<'politics' | 'education' | 'business' | 'local' | 'sports'> = 
      ['politics', 'education', 'business', 'local', 'sports'];
    
    const result: any = {};
    const excludeIds: number[] = [];

    for (const category of categories) {
      try {
        result[category] = await this.fetchNewsByCategory({
          category,
          source: 'national',
          limit,
          exclude_ids: excludeIds
        });
        
        // Add to exclude list to prevent duplicates
        result[category].forEach((news: TrendingNewsResponse) => excludeIds.push(news.id));
      } catch (error) {
        console.warn(`Failed to fetch national ${category} news:`, error);
        result[category] = [];
      }
    }

    return result;
  }

  // Get all world latest news across all categories
  async getWorldLatestNews(limit: number = 5): Promise<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  }> {
    const categories: Array<'politics' | 'education' | 'business' | 'local' | 'sports'> = 
      ['politics', 'education', 'business', 'local', 'sports'];
    
    const result: any = {};
    const excludeIds: number[] = [];

    for (const category of categories) {
      try {
        result[category] = await this.fetchNewsByCategory({
          category,
          source: 'world',
          limit,
          exclude_ids: excludeIds
        });
        
        // Add to exclude list to prevent duplicates
        result[category].forEach((news: TrendingNewsResponse) => excludeIds.push(news.id));
      } catch (error) {
        console.warn(`Failed to fetch world ${category} news:`, error);
        result[category] = [];
      }
    }

    return result;
  }
}

// Create service instance
export const feedFilesApiService = new FeedFilesApiService();

// Cached versions of frequently used methods
export const cachedFeedFilesApi = {
  fetchFeedFiles: withCache(
    feedFilesApiService.fetchFeedFiles.bind(feedFilesApiService),
    2 * 60 * 1000, // 2 minutes cache
    () => 'feed_files_all'
  ),

  getNationalLatestNews: withCache(
    feedFilesApiService.getNationalLatestNews.bind(feedFilesApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `national_latest_news_${limit}`
  ),

  getWorldLatestNews: withCache(
    feedFilesApiService.getWorldLatestNews.bind(feedFilesApiService),
    2 * 60 * 1000, // 2 minutes cache
    (limit) => `world_latest_news_${limit}`
  ),

  getLatestNewsByCategory: withCache(
    feedFilesApiService.getLatestNewsByCategory.bind(feedFilesApiService),
    1 * 60 * 1000, // 1 minute cache for category-specific news
    (category, source, limit) => `latest_news_${category}_${source}_${limit}`
  ),

  fetchNewsByCategory: withCache(
    feedFilesApiService.fetchNewsByCategory.bind(feedFilesApiService),
    1 * 60 * 1000, // 1 minute cache
    (request) => `news_by_category_${request.category}_${request.source}_${request.limit || 10}`
  ),
};

// Export the main function for backward compatibility
export const fetchFeedFiles = cachedFeedFilesApi.fetchFeedFiles;
