import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

const NationalArticleFallback: React.FC = () => {
  const [articles, setArticles] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch five latest national articles
  useEffect(() => {
    const fetchLatestNationalArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📰 Fetching 5 latest national articles for slider');
        
        // Get latest national trending news (limit 5)
        const data = await cachedTrendingApi.getTrendingNationalNewsForCarousel(5);
        
        if (data && data.length > 0) {
          console.log(`✅ Found ${data.length} latest national articles`);
          setArticles(data);
        } else {
          console.log('⚠️ No national articles found');
          setError('No national articles available');
        }
      } catch (err) {
        console.error('Error fetching latest national articles:', err);
        setError('Failed to load national articles');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNationalArticles();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (articles.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [articles.length, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (articles.length > 1) {
        if (event.key === 'ArrowLeft') {
          goToPrevious();
        } else if (event.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [articles.length]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0 small">Loading latest national news...</p>
        </div>
      </div>
    );
  }

  // Error state or no articles
  if (error || articles.length === 0) {
    return (
      <div className="alert alert-info border-0 rounded-3">
        <i className="bi bi-info-circle me-2"></i>
        News carousel temporarily unavailable
      </div>
    );
  }

  // Display the slider with latest national articles
  return (
    <div 
      className="national-news-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div className="slider-container position-relative">
        <div 
          className="slider-wrapper"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className="slider-slide"
              style={{ width: '100%', flexShrink: 0 }}
            >
              <div 
                className="card border-0 shadow-sm national-article-fallback"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/category-news/${article.id}`)}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover', minHeight: '200px' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/400/200?random=${article.id}`;
                        }}
                      />
                    ) : (
                      <div 
                        className="h-100 d-flex align-items-center justify-content-center rounded-start"
                        style={{ 
                          minHeight: '200px',
                          background: 'linear-gradient(135deg, #1e40af20 0%, #1e40af40 100%)' 
                        }}
                      >
                        <i className="bi bi-newspaper text-white" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body h-100 d-flex flex-column p-4">
                      <div className="mb-2">
                        <span className="badge bg-primary text-white">
                          <i className="bi bi-newspaper me-1"></i>
                          Latest National News {index + 1}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold mb-3" style={{ 
                        color: '#1e40af',
                        fontSize: '1.1rem',
                        lineHeight: '1.3',
                        minHeight: '2.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {article.title}
                      </h5>
                      <p className="card-text flex-grow-1 text-muted" style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        minHeight: '3.2rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {article.description}
                      </p>
                      <div className="mt-auto">
                        <small className="text-muted">
                          By {article.author || 'Unknown'} • {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recently'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {articles.length > 1 && (
          <>
            <button 
              className="slider-nav slider-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous article"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="slider-nav slider-nav-next"
              onClick={goToNext}
              aria-label="Next article"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator and Slide Counter */}
      {articles.length > 1 && (
        <div className="slider-controls mt-3 d-flex justify-content-between align-items-center">
          <div className="slider-counter">
            <small className="text-muted">
              {currentSlide + 1} of {articles.length}
            </small>
          </div>
          <div className="slider-dots d-flex">
            {articles.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="slider-pause-indicator">
            {isPaused && (
              <small className="text-muted">
                <i className="bi bi-pause-circle me-1"></i>
                Paused
              </small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NationalArticleFallback;
