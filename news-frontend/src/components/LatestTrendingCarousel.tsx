import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

interface LatestTrendingCarouselProps {
  limit?: number;
}

const LatestTrendingCarousel: React.FC<LatestTrendingCarouselProps> = ({ 
  limit = 10 
}) => {
  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch latest trending news data
  useEffect(() => {
    const fetchLatestTrendingNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔥 Fetching latest trending news for carousel with limit:', limit);
        const data = await cachedTrendingApi.getLatestTrendingNews(limit);
        
        console.log('📊 Received latest trending news for carousel:', data.length, 'articles');
        
        // Validate that we have trending news (be more flexible with categories)
        const validatedTrendingData = data.filter(item => {
          const category = item.category?.toLowerCase();
          const isTrending = item.is_trending || category === 'trending' || (item.trending_score && item.trending_score > 0);
          
          if (isTrending) {
            console.log(`✅ Carousel trending article: "${item.title}" - Category: ${category}, is_trending: ${item.is_trending}, trending_score: ${item.trending_score}`);
          } else {
            console.log(`❌ Non-trending article filtered out: "${item.title}" - Category: ${category}, is_trending: ${item.is_trending}, trending_score: ${item.trending_score}`);
          }
          return isTrending;
        });
        
        console.log(`🎉 Carousel: ${validatedTrendingData.length} PURE trending articles (filtered from ${data.length} total)`);
        
        // If no trending data after filtering, use fallback data
        if (validatedTrendingData.length === 0) {
          console.log('No trending data found, using fallback data');
          const fallbackData: TrendingNewsResponse[] = [
            { 
              id: 1, 
              title: "🔥 Climate Summit 2025: Global Leaders Commit to Net Zero", 
              description: "World leaders gather in Paris to announce ambitious climate targets and renewable energy investments worth $2 trillion.", 
              content: "World leaders from over 190 countries gathered in Paris today for the 2025 Climate Summit, marking a historic moment in global climate action.",
              image_url: "https://picsum.photos/400/300?random=1", 
              read_more_url: "https://example.com/climate-summit-2025", 
              category: "trending", 
              author: "Sarah Johnson",
              created_at: new Date().toISOString(), 
              trending_score: 95.5,
              trending_rank: 1,
              views_count: 15420,
              likes_count: 892,
              is_live: true,
              is_trending: true
            },
            { 
              id: 2, 
              title: "🚀 Breakthrough in Quantum Computing Achieved", 
              description: "Scientists at MIT announce a major breakthrough in quantum computing that could revolutionize data processing.", 
              content: "Researchers at the Massachusetts Institute of Technology have achieved a groundbreaking milestone in quantum computing, successfully maintaining quantum coherence for over 10 minutes.",
              image_url: "https://picsum.photos/400/300?random=2", 
              read_more_url: "https://example.com/quantum-computing-breakthrough", 
              category: "trending", 
              author: "Dr. Michael Chen",
              created_at: new Date().toISOString(), 
              trending_score: 88.3,
              trending_rank: 2,
              views_count: 12350,
              likes_count: 756,
              is_live: true,
              is_trending: true
            },
            { 
              id: 3, 
              title: "💼 Economic Policy Changes Impact Global Markets", 
              description: "New economic policies announced by major economies are causing significant movements in global financial markets.", 
              content: "New economic policies announced by major economies are causing significant movements in global financial markets. Investors are closely watching the developments.",
              image_url: "https://picsum.photos/400/300?random=3", 
              read_more_url: "https://example.com/economic-policy-changes", 
              category: "trending", 
              author: "Robert Williams",
              created_at: new Date().toISOString(), 
              trending_score: 82.7,
              trending_rank: 3,
              views_count: 9870,
              likes_count: 543,
              is_live: true,
              is_trending: true
            },
            { 
              id: 4, 
              title: "🏥 Medical Innovation: New Cancer Treatment Shows Promise", 
              description: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients.", 
              content: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients. The breakthrough could change cancer care forever.",
              image_url: "https://picsum.photos/400/300?random=4", 
              read_more_url: "https://example.com/cancer-treatment-breakthrough", 
              category: "trending", 
              author: "Dr. Emily Rodriguez",
              created_at: new Date().toISOString(), 
              trending_score: 78.9,
              trending_rank: 4,
              views_count: 8760,
              likes_count: 432,
              is_live: true,
              is_trending: true
            },
            { 
              id: 5, 
              title: "🌌 Space Mission Discovers Water on Mars", 
              description: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization.", 
              content: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization. This discovery opens new possibilities for space exploration.",
              image_url: "https://picsum.photos/400/300?random=5", 
              read_more_url: "https://example.com/mars-water-discovery", 
              category: "trending", 
              author: "Space Reporter",
              created_at: new Date().toISOString(), 
              trending_score: 75.3,
              trending_rank: 5,
              views_count: 7650,
              likes_count: 321,
              is_live: true,
              is_trending: true
            }
          ];
          setTrendingNews(fallbackData.slice(0, limit));
        } else {
          setTrendingNews(validatedTrendingData);
        }
      } catch (err) {
        console.error('Error fetching latest trending news for carousel:', err);
        setError('Failed to load latest trending news');
        
        // Provide fallback data to prevent empty state
        const fallbackData: TrendingNewsResponse[] = [
          { 
            id: 1, 
            title: "🔥 Climate Summit 2025: Global Leaders Commit to Net Zero", 
            description: "World leaders gather in Paris to announce ambitious climate targets and renewable energy investments worth $2 trillion.", 
            content: "World leaders from over 190 countries gathered in Paris today for the 2025 Climate Summit, marking a historic moment in global climate action.",
            image_url: "https://picsum.photos/400/300?random=1", 
            read_more_url: "https://example.com/climate-summit-2025", 
            category: "trending", 
            author: "Sarah Johnson",
            created_at: new Date().toISOString(), 
            trending_score: 95.5,
            trending_rank: 1,
            views_count: 15420,
            likes_count: 892,
            is_live: true,
            is_trending: true
          },
          { 
            id: 2, 
            title: "🚀 Breakthrough in Quantum Computing Achieved", 
            description: "Scientists at MIT announce a major breakthrough in quantum computing that could revolutionize data processing.", 
            content: "Researchers at the Massachusetts Institute of Technology have achieved a groundbreaking milestone in quantum computing, successfully maintaining quantum coherence for over 10 minutes.",
            image_url: "https://picsum.photos/400/300?random=2", 
            read_more_url: "https://example.com/quantum-computing-breakthrough", 
            category: "trending", 
            author: "Dr. Michael Chen",
            created_at: new Date().toISOString(), 
            trending_score: 88.3,
            trending_rank: 2,
            views_count: 12350,
            likes_count: 756,
            is_live: true,
            is_trending: true
          },
          { 
            id: 3, 
            title: "💼 Economic Policy Changes Impact Global Markets", 
            description: "New economic policies announced by major economies are causing significant movements in global financial markets.", 
            content: "New economic policies announced by major economies are causing significant movements in global financial markets. Investors are closely watching the developments.",
            image_url: "https://picsum.photos/400/300?random=3", 
            read_more_url: "https://example.com/economic-policy-changes", 
            category: "trending", 
            author: "Robert Williams",
            created_at: new Date().toISOString(), 
            trending_score: 82.7,
            trending_rank: 3,
            views_count: 9870,
            likes_count: 543,
            is_live: true,
            is_trending: true
          },
          { 
            id: 4, 
            title: "🏥 Medical Innovation: New Cancer Treatment Shows Promise", 
            description: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients.", 
            content: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients. The breakthrough could change cancer care forever.",
            image_url: "https://picsum.photos/400/300?random=4", 
            read_more_url: "https://example.com/cancer-treatment-breakthrough", 
            category: "trending", 
            author: "Dr. Emily Rodriguez",
            created_at: new Date().toISOString(), 
            trending_score: 78.9,
            trending_rank: 4,
            views_count: 8760,
            likes_count: 432,
            is_live: true,
            is_trending: true
          },
          { 
            id: 5, 
            title: "🌌 Space Mission Discovers Water on Mars", 
            description: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization.", 
            content: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization. This discovery opens new possibilities for space exploration.",
            image_url: "https://picsum.photos/400/300?random=5", 
            read_more_url: "https://example.com/mars-water-discovery", 
            category: "trending", 
            author: "Space Reporter",
            created_at: new Date().toISOString(), 
            trending_score: 75.3,
            trending_rank: 5,
            views_count: 7650,
            likes_count: 321,
            is_live: true,
            is_trending: true
          }
        ];
        
        setTrendingNews(fallbackData.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTrendingNews();
  }, [limit]);

  // Auto-advance carousel
  useEffect(() => {
    if (trendingNews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [trendingNews.length, isPaused]);

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleNewsClick = (news: TrendingNewsResponse) => {
    console.log('Trending news clicked:', news.title);
    navigate(`/trending/${news.id}`);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingNews.length) % trendingNews.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingNews.length);
  };

  if (loading) {
    return (
      <div className="latest-trending-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading trending news...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="latest-trending-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning text-center" role="alert">
                <h5>Latest trending news carousel temporarily unavailable</h5>
                <p className="mb-0">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trendingNews.length === 0) {
    return (
      <div className="latest-trending-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                <h5>No trending news headlines available at the moment.</h5>
                <p className="mb-0">Please check back later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="latest-trending-carousel">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="carousel-container position-relative">
              {/* Carousel Header */}
              <div className="d-flex justify-content-end align-items-center mb-3">
                <div className="carousel-controls">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={handlePrevSlide}
                    disabled={trendingNews.length <= 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleNextSlide}
                    disabled={trendingNews.length <= 1}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* Main Carousel */}
              <div 
                className="carousel-slide-container position-relative overflow-hidden rounded"
                style={{ height: '400px' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {trendingNews.map((news, index) => (
                  <div
                    key={news.id}
                    className={`carousel-slide position-absolute w-100 h-100 transition-all ${
                      index === currentSlide ? 'active' : 'inactive'
                    }`}
                    style={{
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                      transition: 'transform 0.5s ease-in-out',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleNewsClick(news)}
                  >
                    <div className="h-100 position-relative">
                      {/* Background Image */}
                      <div
                        className="w-100 h-100 position-absolute"
                        style={{
                          backgroundImage: `url(${news.image_url || 'https://picsum.photos/800/400?random=' + news.id})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'brightness(0.7)'
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="position-absolute w-100 h-100" style={{
                        background: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)'
                      }} />
                      
                      {/* Content */}
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white">
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-secondary me-2">🔥 Trending</span>
                          {news.trending_score && (
                            <span className="badge bg-warning me-2">
                              <i className="bi bi-fire me-1"></i>
                              {news.trending_score}
                            </span>
                          )}
                          <small className="text-light">
                            {news.published_at ? new Date(news.published_at).toLocaleDateString() : 'Today'}
                          </small>
                        </div>
                        <h3 className="h4 mb-2 fw-bold text-white">
                          {news.title}
                        </h3>
                        <p className="mb-0 text-light">
                          {news.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              {trendingNews.length > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  {trendingNews.map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm me-1 ${
                        index === currentSlide ? 'btn-secondary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleSlideClick(index)}
                      style={{ width: '12px', height: '12px', borderRadius: '50%', padding: 0 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestTrendingCarousel;