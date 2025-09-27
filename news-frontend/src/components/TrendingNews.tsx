import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

// Use the existing TrendingNewsResponse type from API
type TrendingArticle = TrendingNewsResponse;


interface TrendingNewsProps {
  limit?: number; // Number of articles to show (e.g., 10 for home)
  compact?: boolean; // Show compact view for home page
  showViewMore?: boolean; // Show view more button
  title?: string; // Custom title for the section
  category?: string; // Filter by specific category
}

const TrendingNews: React.FC<TrendingNewsProps> = ({ limit = 10, compact = false, showViewMore = true, title = "Trending News", category }) => {
  const [trending, setTrending] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('TrendingNews component rendering with limit:', limit, 'compact:', compact, 'trending data:', trending.length);

  // Fetch trending news from API
  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use category-specific API if category is provided
        console.log('Fetching trending news from API...');
        let news: TrendingNewsResponse[];
        
        if (category) {
          // Use the category-specific API endpoint
          const { trendingApiService } = await import("../services/trendingApi");
          news = await trendingApiService.getTrendingNewsByCategory(category, 1, limit * 2);
          
          // Additional client-side filtering to ensure no mixing
          news = news.filter(item => 
            item.category && 
            item.category.toLowerCase() === category.toLowerCase()
          );
          console.log(`Fetched ${news.length} articles for ${category} category`);
        } else {
          // Use general trending news API
          news = await cachedTrendingApi.getLatestTrendingNews(limit * 2);
        }
        
        // Limit the results
        news = news.slice(0, limit);
        console.log('Received trending news:', news);
        setTrending(news);
      } catch (err) {
        console.error('Error fetching trending news:', err);
        setError('Failed to load trending news');
        
        // Provide fallback data to prevent white screen
        let fallbackData: TrendingArticle[] = [
          { 
            id: 1, 
            title: "Climate Summit 2025: Global Leaders Commit to Net Zero", 
            description: "World leaders gather in Paris to announce ambitious climate targets and renewable energy investments worth $2 trillion.", 
            content: "World leaders from over 190 countries gathered in Paris today for the 2025 Climate Summit, marking a historic moment in global climate action.",
            image_url: "https://picsum.photos/400/300?random=1", 
            read_more_url: "https://example.com/climate-summit-2025", 
            category: "Environment", 
            author: "Sarah Johnson",
            created_at: new Date().toISOString(), 
            trending_score: 95.5,
            trending_rank: 1,
            views_count: 15420,
            likes_count: 892,
            is_live: true
          },
          { 
            id: 2, 
            title: "Breakthrough in Quantum Computing Achieved", 
            description: "Scientists at MIT announce a major breakthrough in quantum computing that could revolutionize data processing.", 
            content: "Researchers at the Massachusetts Institute of Technology have achieved a groundbreaking milestone in quantum computing, successfully maintaining quantum coherence for over 10 minutes.",
            image_url: "https://picsum.photos/400/300?random=2", 
            read_more_url: "https://example.com/quantum-computing-breakthrough", 
            category: "Technology", 
            author: "Dr. Michael Chen",
            created_at: new Date().toISOString(), 
            trending_score: 88.3,
            trending_rank: 2,
            views_count: 12350,
            likes_count: 756,
            is_live: true
          },
          { 
            id: 3, 
            title: "Economic Policy Changes Impact Global Markets", 
            description: "New economic policies announced by major economies are causing significant movements in global financial markets.", 
            content: "New economic policies announced by major economies are causing significant movements in global financial markets. Investors are closely watching the developments.",
            image_url: "https://picsum.photos/400/300?random=3", 
            read_more_url: "https://example.com/economic-policy-changes", 
            category: "Business", 
            author: "Robert Williams",
            created_at: new Date().toISOString(), 
            trending_score: 82.7,
            trending_rank: 3,
            views_count: 9870,
            likes_count: 543,
            is_live: true
          },
          { 
            id: 4, 
            title: "Medical Innovation: New Cancer Treatment Shows Promise", 
            description: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients.", 
            content: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients. The breakthrough could change cancer care forever.",
            image_url: "https://picsum.photos/400/300?random=4", 
            read_more_url: "https://example.com/cancer-treatment-breakthrough", 
            category: "Health", 
            author: "Dr. Emily Rodriguez",
            created_at: new Date().toISOString(), 
            trending_score: 78.9,
            trending_rank: 4,
            views_count: 8760,
            likes_count: 432,
            is_live: true
          },
          { 
            id: 5, 
            title: "Space Mission Discovers Water on Mars", 
            description: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization.", 
            content: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization. This discovery opens new possibilities for space exploration.",
            image_url: "https://picsum.photos/400/300?random=5", 
            read_more_url: "https://example.com/mars-water-discovery", 
            category: "Science", 
            author: "Space Reporter",
            created_at: new Date().toISOString(), 
            trending_score: 75.3,
            trending_rank: 5,
            views_count: 7650,
            likes_count: 321,
            is_live: true
          }
        ];
        
        // Filter fallback data by category if specified
        if (category) {
          fallbackData = fallbackData.filter(item => 
            item.category && 
            item.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        setTrending(fallbackData.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNews();
  }, [limit, category]);

  const displayedTrending = trending.slice(0, limit);

  // Loading state
  if (loading) {
    return (
      <div className="trending-list">
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="text-center">
            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small className="text-muted">Loading trending...</small>
          </div>
        </div>
      </div>
    );
  }

  // Error state (with fallback data)
  if (error && trending.length === 0) {
    return (
      <div className="trending-list">
        <div className="alert alert-warning alert-sm mb-3" role="alert">
          <small>
            <i className="bi bi-exclamation-triangle me-1"></i>
            {error}. Showing cached data.
          </small>
        </div>
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="text-center">
            <i className="bi bi-wifi-off text-muted mb-2" style={{ fontSize: '1.5rem' }}></i>
            <small className="text-muted">No trending data available</small>
          </div>
        </div>
      </div>
    );
  }

  // Compact view for home page
  if (compact) {
    return (
      <div className="trending-list">
        
        {error && (
          <div className="alert alert-info alert-sm mb-3" role="alert">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              Showing trending news from our database.
            </small>
          </div>
        )}
        
        <div className="list-group list-group-flush">
          {displayedTrending.map((item, index) => {
            const displayTitle = item.title || `Trending ${index + 1}`;
            // Use content if available, otherwise use description, limit to 2 lines (approximately 120 characters)
            const contentText = item.content || item.description || '';
            const shortContent = contentText.length > 120 ? contentText.substring(0, 120) + '...' : contentText;
            
            return (
              <div 
                key={item.id || index} 
                className="list-group-item list-group-item-action border-0 px-0 py-2 trending-item-compact"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/trending/detail/${item.id}`)}
              >
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold" style={{ 
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: '#0d9488'
                    }}>
                      {displayTitle}
                    </h6>
                    <p className="mb-0 text-muted" style={{ 
                      fontSize: '0.8rem', 
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {shortContent}
                    </p>
                  </div>
                  <i className="bi bi-chevron-right text-muted ms-2"></i>
                </div>
              </div>
            );
          })}
        </div>
        
        {showViewMore && (
          <div className="text-center mt-3">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate('/trending')}
            >
              View All Trending
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full view for trending page
  return (
    <div className="trending-news-grid">
      
      {error && (
        <div className="alert alert-info alert-sm mb-3" role="alert">
          <small>
            <i className="bi bi-info-circle me-1"></i>
            Showing trending news from our database.
          </small>
        </div>
      )}
      
      <div className="row g-3">
        {displayedTrending.map((item, index) => {
          // Handle both API data format and fallback data format
          const displayTitle = item.title || `Trending ${index + 1}`;

          return (
            <div key={item.id || index} className="col-lg-4 col-md-6 col-sm-12">
              <div 
                className="card h-100 shadow-sm border-0 trending-article-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/trending/detail/${item.id}`)}
              >
                {/* Article Image */}
                <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={displayTitle}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/400/200?random=${item.id}`;
                      }}
                    />
                  ) : (
                    <div 
                      className="w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      <i className="bi bi-image text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="card-body d-flex flex-column">

                  {/* Article Title */}
                  <h6 className="news-card-title mb-2">
                    {displayTitle}
                  </h6>

                  {/* Article Description */}
                  {item.description && (
                    <p className="news-card-text flex-grow-1">
                      {item.description}
                    </p>
                  )}

                  {/* Article Meta */}
                  <div className="mt-3">
                    {item.author && (
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-person me-1"></i>
                        {item.author}
                      </small>
                    )}
                  </div>

                  {/* Read More Button */}
                  <div className="d-flex justify-content-start align-items-center mt-auto">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trending/detail/${item.id}`);
                      }}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingNews;

// Add custom styles for the trending article cards
const trendingStyles = `
  .trending-article-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
    border: 1px solid rgba(13, 148, 136, 0.1);
    background: #ffffff;
  }
  
  .trending-article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(13, 148, 136, 0.15) !important;
    border-color: rgba(13, 148, 136, 0.2);
  }
  
  .card-img-top-container {
    border-radius: 12px 12px 0 0;
  }
  
  .trending-news-grid {
    padding: 1rem 0;
  }
  
  .trending-item-compact {
    transition: all 0.2s ease;
    border-left: 3px solid transparent !important;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  
  .trending-item-compact:hover {
    background-color: rgba(13, 148, 136, 0.05) !important;
    border-left-color: #0d9488 !important;
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
  }
  
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = trendingStyles;
  document.head.appendChild(styleSheet);
}
