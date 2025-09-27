import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import { apiClient } from "../services/apiClient";
import type { TrendingNewsResponse } from "../types/api";

interface LatestEducationCarouselProps {
  limit?: number;
}

const LatestEducationCarousel: React.FC<LatestEducationCarouselProps> = ({ 
  limit = 10 
}) => {
  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch latest education news data
  useEffect(() => {
    const fetchLatestEducationNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎓 Fetching latest education news for carousel with limit:', limit);
        console.log('🎓 API Client base URL:', apiClient.defaults.baseURL);
        console.log('🎓 API Client timeout:', apiClient.defaults.timeout);
        
        let data: TrendingNewsResponse[] = [];
        
        // Try multiple approaches to get education news
        try {
          // Approach 1: Try education trending API with category_type=education
          data = await cachedTrendingApi.getLatestTrendingEducationNews(limit);
          console.log('📊 Education trending API (category_type=education) result:', data.length, 'articles');
        } catch (educationError) {
          console.warn('Education trending API (category_type=education) failed:', educationError);
        }
        
        // If no data, try general trending news and filter for education
        if (data.length === 0) {
          try {
            console.log('🔄 Trying general trending news with education filter...');
            const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
            console.log('📊 General trending news result:', allTrendingData.length, 'articles');
            
            // Filter for education-related content (multiple criteria)
            data = allTrendingData.filter(item => {
              const category = item.category?.toLowerCase();
              const categoryType = item.category_type?.toLowerCase();
              const title = item.title?.toLowerCase() || '';
              const description = item.description?.toLowerCase() || '';
              
              // Check if it's education-related by multiple criteria
              const isEducationByCategory = category === 'education';
              const isEducationByCategoryType = categoryType === 'education';
              const isEducationByContent = title.includes('education') || 
                                        title.includes('school') || 
                                        title.includes('university') || 
                                        title.includes('college') || 
                                        title.includes('student') || 
                                        title.includes('teacher') || 
                                        title.includes('learning') || 
                                        title.includes('academic') || 
                                        title.includes('study') || 
                                        title.includes('research') ||
                                        title.includes('scholarship') ||
                                        title.includes('curriculum') ||
                                        description.includes('education') ||
                                        description.includes('school') ||
                                        description.includes('university') ||
                                        description.includes('learning');
              
              return isEducationByCategory || isEducationByCategoryType || isEducationByContent;
            });
            console.log('📊 Filtered education news:', data.length, 'articles');
          } catch (generalError) {
            console.warn('General trending API failed:', generalError);
          }
        }
        
        // If still no data, create sample education news for demonstration
        if (data.length === 0) {
          console.log('🔄 No education news found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🎓 Latest Education Updates",
              description: "Stay tuned for the latest education news and academic updates from around the world.",
              content: "Education news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "📚 Academic Research Updates",
              description: "Get the latest updates from universities and research institutions worldwide.",
              content: "Academic research and university updates will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🏫 School News Updates",
              description: "Latest updates from schools and educational institutions worldwide.",
              content: "School news and educational developments will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 90
            }
          ];
          console.log('📊 Created sample education data:', data.length, 'articles');
        }
        
        console.log(`🎉 Carousel: ${data.length} education articles ready to display`);
        setTrendingNews(data);
      } catch (err) {
        console.error('Error fetching latest education news for carousel:', err);
        setError('Failed to load latest education news');
        setTrendingNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEducationNews();
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
    console.log('Education news clicked:', news.title);
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
      <div className="latest-education-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading education news...</span>
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
      <div className="latest-education-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning text-center" role="alert">
                <h5>Latest education trending news carousel temporarily unavailable</h5>
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
      <div className="latest-education-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                <h5>No education news headlines available at the moment.</h5>
                <p className="mb-0">Please check back later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="latest-education-carousel">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="carousel-container position-relative">
              {/* Carousel Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="carousel-title mb-0">
                  <span className="badge bg-primary me-2">🎓</span>
                  Latest Education News
                </h2>
                <div className="carousel-controls">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={handlePrevSlide}
                    disabled={trendingNews.length <= 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
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
                        background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
                      }} />
                      
                      {/* Content */}
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white">
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-primary me-2">🎓 Education</span>
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
                        index === currentSlide ? 'btn-primary' : 'btn-outline-primary'
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

export default LatestEducationCarousel;
