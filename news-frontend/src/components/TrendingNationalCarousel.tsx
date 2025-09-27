import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

interface TrendingNationalCarouselProps {
  limit?: number;
}

const TrendingNationalCarousel: React.FC<TrendingNationalCarouselProps> = ({ 
  limit = 5 
}) => {
  const [trendingNews, setTrendingNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch trending national news data
  useEffect(() => {
    const fetchTrendingNationalNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎠 Fetching trending national news for carousel with limit:', limit);
        const data = await cachedTrendingApi.getTrendingNationalNewsForCarousel(limit);
        
        console.log('📊 Received trending national news for carousel:', data.length, 'articles');
        
        // Validate that we only have national news
        const validatedNationalData = data.filter(item => {
          const source = item.source?.toLowerCase();
          const category = item.category?.toLowerCase();
          const isNational = source === 'national' || category === 'national';
          
          if (isNational) {
            console.log(`✅ Carousel national article: "${item.title}" - Source: ${source}, Category: ${category}`);
          } else {
            console.log(`❌ Non-national article filtered out: "${item.title}" - Source: ${source}, Category: ${category}`);
          }
          return isNational;
        });
        
        console.log(`🎉 Carousel: ${validatedNationalData.length} PURE national articles (filtered from ${data.length} total)`);
        setTrendingNews(validatedNationalData);
      } catch (err) {
        console.error('Error fetching trending national news for carousel:', err);
        setError('Failed to load trending national news');
        setTrendingNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNationalNews();
  }, [limit]);


  // Loading state
  if (loading) {
    return (
      <div className="trending-national-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#f8f9fa',
              color: '#6c757d'
            }}
          >
            <i className="bi bi-fire" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#212529' }}>
              National News Headlines (Loading...)
            </h5>
            <p className="text-muted mb-0 small">
              Fetching latest trending stories from across the nation
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
      <div className="trending-national-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#f8f9fa',
              color: '#6c757d'
            }}
          >
            <i className="bi bi-fire" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#212529' }}>
              National News Headlines
            </h5>
            <p className="text-muted mb-0 small">
              Latest trending stories from across the nation
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
      <div className="trending-national-carousel mb-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="category-icon me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#f8f9fa',
              color: '#6c757d'
            }}
          >
            <i className="bi bi-fire" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h5 className="section-title mb-0" style={{ color: '#212529' }}>
              National News Headlines
            </h5>
            <p className="text-muted mb-0 small">
              Latest trending stories from across the nation
            </p>
          </div>
        </div>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No trending national news available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="trending-national-carousel mb-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <div 
          className="category-icon me-3 d-flex align-items-center justify-content-center"
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#1e40af20',
            color: '#1e40af'
          }}
        >
          <i className="bi bi-fire" style={{ fontSize: '1.2rem' }}></i>
        </div>
        <div>
          <h5 className="section-title mb-0" style={{ color: '#212529' }}>
            National News Headlines
          </h5>
          <p className="text-muted mb-0 small">
            Latest trending stories from across the nation • {trendingNews.length} articles
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
      <div id="trendingNationalCarousel" className="carousel slide" data-bs-ride="carousel">
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
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' 
                        }}
                      >
                        <i className="bi bi-newspaper text-white" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body h-100 d-flex flex-column p-4">
                      <div className="mb-2">
                        <span className="badge bg-secondary text-white">
                          <i className="bi bi-fire me-1"></i>
                          Trending
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
            <button className="carousel-control-prev" type="button" data-bs-target="#trendingNationalCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#trendingNationalCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingNationalCarousel;
