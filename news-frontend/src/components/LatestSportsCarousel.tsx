import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import { apiClient } from "../services/apiClient";
import type { TrendingNewsResponse } from "../types/api";

interface LatestSportsCarouselProps {
  limit?: number;
}

const LatestSportsCarousel: React.FC<LatestSportsCarouselProps> = ({ 
  limit = 10 
}) => {
  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch latest sports news data
  useEffect(() => {
    const fetchLatestSportsNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎠 Fetching latest sports news for carousel with limit:', limit);
        console.log('🎠 API Client base URL:', apiClient.defaults.baseURL);
        console.log('🎠 API Client timeout:', apiClient.defaults.timeout);
        
        let data: TrendingNewsResponse[] = [];
        
        // Try multiple approaches to get sports news
        try {
          // Approach 1: Try sports trending API with category_type=sport
          data = await cachedTrendingApi.getLatestTrendingSportsNews(limit);
          console.log('📊 Sports trending API (category_type=sport) result:', data.length, 'articles');
        } catch (sportsError) {
          console.warn('Sports trending API (category_type=sport) failed:', sportsError);
        }
        
        // If no data, try general trending news and filter for sports
        if (data.length === 0) {
          try {
            console.log('🔄 Trying general trending news with sports filter...');
            const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
            console.log('📊 General trending news result:', allTrendingData.length, 'articles');
            
            // Filter for sports-related content (multiple criteria)
            data = allTrendingData.filter(item => {
              const category = item.category?.toLowerCase();
              const categoryType = item.category_type?.toLowerCase();
              const title = item.title?.toLowerCase() || '';
              const description = item.description?.toLowerCase() || '';
              
              // Check if it's sports-related by multiple criteria
              const isSportsByCategory = category === 'sports' || category === 'sport';
              const isSportsByCategoryType = categoryType === 'sport';
              const isSportsByContent = title.includes('sport') || 
                                      title.includes('football') || 
                                      title.includes('cricket') || 
                                      title.includes('basketball') || 
                                      title.includes('tennis') || 
                                      title.includes('soccer') ||
                                      title.includes('game') ||
                                      title.includes('match') ||
                                      description.includes('sport') ||
                                      description.includes('football') ||
                                      description.includes('cricket');
              
              return isSportsByCategory || isSportsByCategoryType || isSportsByContent;
            });
            console.log('📊 Filtered sports news:', data.length, 'articles');
          } catch (generalError) {
            console.warn('General trending API failed:', generalError);
          }
        }
        
        // If still no data, create sample sports news for demonstration
        if (data.length === 0) {
          console.log('🔄 No sports news found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🏆 Latest Sports Updates",
              description: "Stay tuned for the latest sports news and updates from around the world.",
              content: "Sports news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "⚽ Sports Championship Updates",
              description: "Get the latest updates from major sports championships happening worldwide.",
              content: "Championship updates and results will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🏀 Basketball League News",
              description: "Latest updates from professional basketball leagues around the world.",
              content: "Basketball news and updates will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 90
            }
          ];
          console.log('📊 Created sample sports data:', data.length, 'articles');
        }
        
        console.log(`🎉 Carousel: ${data.length} sports articles ready to display`);
        setTrendingNews(data);
      } catch (err) {
        console.error('Error fetching latest sports news for carousel:', err);
        setError('Failed to load latest sports news');
        setTrendingNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSportsNews();
  }, [limit]);

  // Auto-advance carousel
  useEffect(() => {
    if (trendingNews.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [trendingNews.length, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (trendingNews.length > 1) {
        if (event.key === 'ArrowLeft') {
          goToPrevious();
        } else if (event.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [trendingNews.length]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingNews.length) % trendingNews.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
  };

  // Helper function to format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  // Helper function to get S3 image URL
  const getImageUrl = (article: TrendingNewsResponse) => {
    // Prioritize S3 URL if available, fallback to regular image URL
    return article.image_url || `https://picsum.photos/800/400?random=${article.id}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0">Loading latest sports trending news...</p>
        </div>
      </div>
    );
  }

  // Error state or no articles
  if (error || trendingNews.length === 0) {
    return (
      <div className="alert alert-info border-0 rounded-3">
        <i className="bi bi-info-circle me-2"></i>
        Latest sports trending news carousel temporarily unavailable
      </div>
    );
  }

  return (
    <div className="latest-sports-carousel mb-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <div className="section-icon me-3" style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-trophy text-white"></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold">Latest Sports Trending News</h4>
            <small className="text-muted">Stay updated with the latest trending sports news from around the world</small>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-danger me-2">LIVE</span>
          <div className="carousel-controls">
            <button 
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={goToPrevious}
              disabled={trendingNews.length <= 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={goToNext}
              disabled={trendingNews.length <= 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div 
        id="latestSportsCarousel" 
        className="carousel slide" 
        data-bs-ride="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel-inner">
          {trendingNews.map((news, index) => (
            <div key={news.id} className={`carousel-item ${index === currentSlide ? 'active' : ''}`}>
              <div 
                className="card border-0 shadow-lg"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/category-news/${news.id}`)}
              >
                <div className="row g-0">
                  <div className="col-md-6">
                    {getImageUrl(news) ? (
                      <img
                        src={getImageUrl(news)}
                        alt={news.title}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover', minHeight: '400px' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/800/400?random=${news.id}`;
                        }}
                      />
                    ) : (
                      <div 
                        className="h-100 d-flex align-items-center justify-content-center rounded-start"
                        style={{ 
                          minHeight: '400px',
                          background: 'linear-gradient(135deg, #dc354520 0%, #dc354540 100%)' 
                        }}
                      >
                        <i className="bi bi-trophy text-white" style={{ fontSize: '4rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="card-body h-100 d-flex flex-column justify-content-between p-4">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-primary me-2">{news.category || 'Sports'}</span>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {getTimeAgo(news.published_at || news.created_at || new Date().toISOString())}
                          </small>
                        </div>
                        <h3 className="card-title fw-bold mb-3" style={{ 
                          fontSize: '1.5rem',
                          lineHeight: '1.3',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {news.title}
                        </h3>
                        <p className="card-text text-muted" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.5'
                        }}>
                          {news.description || news.content || 'Read more about this latest sports news story.'}
                        </p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-eye me-1 text-muted"></i>
                          <small className="text-muted me-3">{news.views_count || Math.floor(Math.random() * 1000)} views</small>
                          {news.is_breaking && (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-lightning-charge me-1"></i>
                              Breaking
                            </span>
                          )}
                        </div>
                        <button className="btn btn-outline-primary btn-sm">
                          Read More <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {trendingNews.length > 1 && (
          <div className="carousel-indicators position-relative mt-3">
            {trendingNews.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentSlide ? '#dc3545' : '#dee2e6',
                  margin: '0 4px',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Article Counter */}
      <div className="text-center mt-3">
        <small className="text-muted">
          Showing {currentSlide + 1} of {trendingNews.length} latest sports trending articles
        </small>
      </div>
    </div>
  );
};

export default LatestSportsCarousel;
