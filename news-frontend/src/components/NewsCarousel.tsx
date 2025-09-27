import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cachedTrendingApi } from '../services/trendingApi';
import type { TrendingNewsResponse } from '../types/api';

interface NewsCarouselProps {}

const NewsCarousel: React.FC<NewsCarouselProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch news data from API
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the trending API which we know is working
        let data: TrendingNewsResponse[];
        
        // Get trending national news with source=national and category=trending
        console.log('NewsCarousel: Fetching trending national news for carousel');
        data = await cachedTrendingApi.getLatestTrendingNationalNews(5);
        console.log(`NewsCarousel: Found ${data.length} trending national articles for carousel`);
        
        setNewsData(data);
      } catch (err) {
        console.error('Error fetching carousel news:', err);
        setError('Failed to load news data');
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [newsData.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + newsData.length) % newsData.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % newsData.length);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="news-carousel-section mb-4">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading latest news...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with no data
  if (error && newsData.length === 0) {
    return (
      <div className="news-carousel-section mb-4">
        <div className="container-fluid">
          <div className="alert alert-warning" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // No data state (API succeeded but returned empty)
  if (!loading && !error && newsData.length === 0) {
    const displayName = 'News';
    
    return (
      <div className="news-carousel-section mb-4">
        <div className="container-fluid">
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            <strong>No {displayName} articles available</strong> at the moment. Please check back later or try a different category.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-carousel-section mb-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="carousel-container position-relative">
              <div className="carousel-inner">
                {newsData.map((news, index) => (
                  <div
                    key={news.id}
                    className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                    style={{
                      display: index === currentSlide ? 'block' : 'none'
                    }}
                  >
                    <Link to={`/category-news/${news.id}`} className="text-decoration-none">
                      <div className="carousel-news-card">
                        <div className="row g-0">
                          <div className="col-md-8">
                            <div className="carousel-content p-4">
                              <div className="d-flex align-items-center mb-2">
                                <span className="badge bg-danger me-2">TRENDING</span>
                                <small className="text-muted">
                                  {news.published_at ? formatDate(news.published_at) : 'Recently'}
                                </small>
                              </div>
                              <h2 className="carousel-title mb-3" style={{ color: '#800000' }}>
                                {news.title}
                              </h2>
                              <p className="carousel-description mb-3">
                                {news.description}
                              </p>
                              <div className="d-flex align-items-center">
                                <small className="text-muted me-3">By {news.author || 'Unknown'}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="carousel-image-container">
                              <img
                                src={news.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center'}
                                alt={news.title}
                                className="carousel-image"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="carousel-control carousel-control-prev"
                onClick={goToPrevious}
                type="button"
              >
                &lt;
              </button>
              <button
                className="carousel-control carousel-control-next"
                onClick={goToNext}
                type="button"
              >
                &gt;
              </button>

              {/* Indicators */}
              <div className="carousel-indicators">
                {newsData.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;
