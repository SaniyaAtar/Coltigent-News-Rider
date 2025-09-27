import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trendingApiService } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";

interface NationalNewsArticlesProps {
  className?: string;
}

const NationalNewsArticles: React.FC<NationalNewsArticlesProps> = ({ className = "" }) => {
  const [articles, setArticles] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Fetch national news articles
  useEffect(() => {
    const fetchNationalArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await trendingApiService.getPopularNationalNewsArticles(10, 0);
        
        setArticles(data);
      } catch (err) {
        console.error('Error fetching national news articles:', err);
        setError('Failed to load national news articles');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNationalArticles();
  }, []);

  // Handle show more/less
  const handleToggleShowAll = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  };


  // Get displayed articles (6 initially, 10 when show all)
  const displayedArticles = showAll ? articles : articles.slice(0, 6);

  // Loading state
  if (loading) {
    return (
      <div className={`national-news-articles ${className}`}>
        <div className="modern-section-card">
          <div className="section-header-modern" style={{ 
            background: 'linear-gradient(135deg, #dc3545, #c82333)',
            color: 'white'
          }}>
            <div className="d-flex align-items-center">
              <div className="section-icon-modern" style={{ 
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <h5 className="section-title mb-1">National News Headlines</h5>
                <small className="section-subtitle-modern opacity-75">Latest popular national stories</small>
              </div>
            </div>
          </div>
          <div className="section-content-modern">
            <div className="d-flex justify-content-center align-items-center py-4">
              <div className="modern-spinner"></div>
              <span className="ms-3 text-muted">Loading articles...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && articles.length === 0) {
    return (
      <div className={`national-news-articles ${className}`}>
        <div className="modern-section-card">
          <div className="section-header-modern" style={{ 
            background: 'linear-gradient(135deg, #dc3545, #c82333)',
            color: 'white'
          }}>
            <div className="d-flex align-items-center">
              <div className="section-icon-modern" style={{ 
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <h5 className="section-title mb-1">National News Headlines</h5>
                <small className="section-subtitle-modern opacity-75">Latest popular national stories</small>
              </div>
            </div>
          </div>
          <div className="section-content-modern">
            <div className="alert alert-warning border-0 rounded-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && !error && articles.length === 0) {
    return (
      <div className={`national-news-articles ${className}`}>
        <div className="modern-section-card">
          <div className="section-header-modern" style={{ 
            background: 'linear-gradient(135deg, #dc3545, #c82333)',
            color: 'white'
          }}>
            <div className="d-flex align-items-center">
              <div className="section-icon-modern" style={{ 
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <h5 className="section-title mb-1">National News Headlines</h5>
                <small className="section-subtitle-modern opacity-75">Latest popular national stories</small>
              </div>
            </div>
          </div>
          <div className="section-content-modern">
            <div className="alert alert-info border-0 rounded-3">
              <i className="bi bi-info-circle me-2"></i>
              No national news articles available at the moment.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`national-news-articles ${className}`}>
      <div className="modern-section-card">
        <div className="section-header-modern" style={{ 
          background: 'linear-gradient(135deg, #dc3545, #c82333)',
          color: 'white'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="section-icon-modern" style={{ 
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <h5 className="section-title mb-1">National News Headlines</h5>
                <small className="section-subtitle-modern opacity-75">
                  Latest popular national stories • {displayedArticles.length} of {articles.length} articles
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="section-content-modern" style={{ 
          background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)'
        }}>
          <div className="row g-3">
            {displayedArticles.map((article) => (
              <div key={article.id} className="col-12">
                <div 
                  className="national-article-item p-3 border rounded-3"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(220, 53, 69, 0.1) !important'
                  }}
                  onClick={() => navigate(`/category-news/${article.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff5f5';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.15)';
                    e.currentTarget.style.borderColor = '#dc3545';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.1)';
                  }}
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="rounded-3"
                          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/80/60?random=${article.id}`;
                          }}
                        />
                      ) : (
                        <div 
                          className="rounded-3 d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '80px', 
                            height: '60px', 
                            background: 'linear-gradient(135deg, #dc354520 0%, #dc354540 100%)' 
                          }}
                        >
                          <i className="bi bi-newspaper text-danger" style={{ fontSize: '1.2rem' }}></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-danger text-white me-2" style={{ fontSize: '0.7rem' }}>
                          National
                        </span>
                      </div>
                      <h6 className="mb-2 fw-bold" style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: '#2c3e50'
                      }}>
                        {article.title}
                      </h6>
                      {article.description && (
                        <p className="mb-2 text-muted" style={{ 
                          fontSize: '0.85rem', 
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.description}
                        </p>
                      )}
                      <div className="d-flex align-items-center justify-content-between">
                        <small className="text-muted">
                          <i className="bi bi-person me-1"></i>
                          {article.author || 'Unknown'}
                        </small>
                        <i className="bi bi-chevron-right text-muted"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {articles.length > 6 && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-danger px-4 py-2"
                onClick={handleToggleShowAll}
                style={{ borderRadius: '25px', fontWeight: '600' }}
              >
                {showAll ? (
                  <>
                    <i className="bi bi-dash-circle me-2"></i>
                    Show Less
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Show More ({articles.length - 6} more articles)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NationalNewsArticles;
