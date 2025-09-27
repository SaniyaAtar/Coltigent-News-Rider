import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

interface TrendingWorldCarouselProps {
  limit?: number;
}

const TrendingWorldCarousel: React.FC<TrendingWorldCarouselProps> = ({ 
  limit = 5 
}) => {
  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch trending world news data
  useEffect(() => {
    const fetchTrendingWorldNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🌍 Fetching trending world news for carousel with source=world and category=trending, limit:', limit);
        const data = await cachedTrendingApi.getLatestTrendingWorldNews(limit);
        
        console.log('📊 Received trending world news for carousel:', data.length, 'articles');
        
        // Validate that we only have world trending news
        const validatedWorldData = data.filter(item => {
          const source = item.source?.toLowerCase();
          const category = item.category?.toLowerCase();
          const isWorld = source === 'world';
          const isTrending = category === 'trending';
          
          if (isWorld && isTrending) {
            console.log(`✅ Carousel world trending article: "${item.title}" - Source: ${source}, Category: ${category}`);
          } else {
            console.log(`❌ Non-world-trending article filtered out: "${item.title}" - Source: ${source}, Category: ${category}`);
          }
          return isWorld && isTrending;
        });
        
        console.log(`🎉 Carousel: ${validatedWorldData.length} PURE world trending articles (filtered from ${data.length} total)`);
        setTrendingNews(validatedWorldData);
      } catch (err) {
        console.error('Error fetching trending world news for carousel:', err);
        setError('Failed to load trending world news');
        setTrendingNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingWorldNews();
  }, [limit]);


  // Loading state
  if (loading) {
    return (
      <div className="trending-world-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#0d6efd20',
              color: '#0d6efd'
            }}
          >
            <i className="bi bi-globe" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#0d6efd' }}>
              World News Headlines (Loading...)
            </h5>
            <p className="text-muted mb-0 small">
              Fetching latest trending stories from around the world
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && trendingNews.length === 0) {
    return (
      <div className="trending-world-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#0d6efd20',
              color: '#0d6efd'
            }}
          >
            <i className="bi bi-globe" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#0d6efd' }}>
              World News Headlines
            </h5>
            <p className="text-muted mb-0 small">
              Trending world news with S3 images/videos
            </p>
          </div>
        </div>
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && !error && trendingNews.length === 0) {
    return (
      <div className="trending-world-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#0d6efd20',
              color: '#0d6efd'
            }}
          >
            <i className="bi bi-globe" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#0d6efd' }}>
              World News Headlines
            </h5>
            <p className="text-muted mb-0 small">
              Trending world news with S3 images/videos
            </p>
          </div>
        </div>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No trending world news available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="trending-world-carousel mb-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <div 
          className="category-icon me-3 d-flex align-items-center justify-content-center"
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#0d6efd20',
            color: '#0d6efd'
          }}
        >
          <i className="bi bi-globe" style={{ fontSize: '1.2rem' }}></i>
        </div>
        <div>
          <h5 className="section-title mb-0" style={{ color: '#0d6efd' }}>
            World News Headlines
          </h5>
          <p className="text-muted mb-0 small">
            Trending world news with S3 images/videos • {trendingNews.length} articles
          </p>
        </div>
      </div>

      {error && trendingNews.length > 0 && (
        <div className="alert alert-info alert-sm mb-3" role="alert">
          <i className="bi bi-info-circle me-1"></i>
          <small>Showing cached data. Some articles may not be up to date.</small>
        </div>
      )}

      {/* Carousel */}
      <div id="trendingWorldCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {trendingNews.map((news, index) => (
            <div key={news.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div 
                className="card border-0 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/category-news/${news.id}`)}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    {news.image_url ? (
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover', minHeight: '300px' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/400/200?random=${news.id}`;
                        }}
                      />
                    ) : (
                      <div 
                        className="h-100 d-flex align-items-center justify-content-center rounded-start"
                        style={{ 
                          minHeight: '300px',
                          background: 'linear-gradient(135deg, #0d6efd20 0%, #0d6efd40 100%)' 
                        }}
                      >
                        <i className="bi bi-globe text-white" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body h-100 d-flex flex-column p-4">
                      <div className="mb-2">
                        <span className="badge bg-primary text-white">
                          <i className="bi bi-globe me-1"></i>
                          World
                        </span>
                      </div>
                      <h5 className="card-title fw-bold mb-3" style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.3',
                        minHeight: '2.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{news.title}</h5>
                      <p className="card-text flex-grow-1" style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        minHeight: '3.2rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{news.description}</p>
                      <div className="mt-auto">
                        <small className="text-muted">
                          By {news.author || 'Unknown'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {trendingNews.length > 1 && (
          <>
            <button className="carousel-control-prev" type="button" data-bs-target="#trendingWorldCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#trendingWorldCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingWorldCarousel;
