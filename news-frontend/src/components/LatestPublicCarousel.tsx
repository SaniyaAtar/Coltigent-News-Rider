import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, type CommunityReport } from "../services/communityReportsApi";

interface LatestPublicCarouselProps {
  limit?: number;
}

const LatestPublicCarousel: React.FC<LatestPublicCarouselProps> = ({ 
  limit = 10 
}) => {
  const [publicNews, setPublicNews] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch latest public upload news data
  useEffect(() => {
    const fetchLatestPublicNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📢 Fetching latest public upload news for carousel with limit:', limit);
        const { results } = await fetchUserInfo({ 
          limit: limit, 
          offset: 0, 
          order_by: 'published_date', 
          order_dir: 'desc' 
        });
        
        console.log('📊 Received latest public upload news for carousel:', results.length, 'articles');
        setPublicNews(results);
      } catch (err) {
        console.error('Error fetching latest public upload news for carousel:', err);
        setError('Failed to load latest public upload news');
        setPublicNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPublicNews();
  }, [limit]);

  // Auto-slide functionality
  useEffect(() => {
    if (publicNews.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % publicNews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [publicNews.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + publicNews.length) % publicNews.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % publicNews.length);
  };

  const handleNewsClick = (news: CommunityReport) => {
    navigate(`/public-report/${news.id}`);
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="latest-public-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading public upload news...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="latest-public-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (publicNews.length === 0) {
    return (
      <div className="latest-public-carousel">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-upload display-1 text-muted mb-3"></i>
                <h5 className="text-muted">No Public Upload News Available</h5>
                <p className="text-muted">Check back later for community-uploaded articles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="latest-public-carousel">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {/* Carousel Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">
                <i className="bi bi-upload text-primary me-2"></i>
                Latest Public Upload News
              </h2>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  onClick={() => setIsPaused(!isPaused)}
                  title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                >
                  <i className={`bi ${isPaused ? 'bi-play-fill' : 'bi-pause-fill'}`}></i>
                </button>
                <small className="text-muted">
                  {currentSlide + 1} of {publicNews.length}
                </small>
              </div>
            </div>

            {/* Main Carousel */}
            <div 
              className="carousel-container position-relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="carousel-inner">
                <div 
                  className="carousel-item active"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: 'transform 0.5s ease-in-out'
                  }}
                >
                  <div className="row g-3">
                    {publicNews.map((news) => (
                      <div key={news.id} className="col-lg-4 col-md-6">
                        <div 
                          className="card h-100 shadow-sm border-0 public-carousel-card"
                          onClick={() => handleNewsClick(news)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
                            {news.s3_file_url ? (
                              <img
                                src={news.s3_file_url}
                                alt={news.ai_headline}
                                className="card-img-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://picsum.photos/400/200?random=${news.id}`;
                                }}
                              />
                            ) : (
                              <div 
                                className="w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                                style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
                              >
                                <i className="bi bi-upload text-white" style={{ fontSize: '2rem' }}></i>
                              </div>
                            )}
                          </div>
                          <div className="card-body d-flex flex-column">
                            <div className="mb-2">
                              <span className="badge bg-primary me-2">
                                <i className="bi bi-upload me-1"></i>
                                Public Upload
                              </span>
                            </div>
                            <h5 className="card-title fw-bold mb-3" style={{ 
                              fontSize: '1.1rem',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              color: '#007bff'
                            }}>
                              {news.ai_headline}
                            </h5>
                            <p className="card-text text-muted flex-grow-1" style={{
                              fontSize: '0.9rem',
                              lineHeight: '1.4',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {news.ai_summary}
                            </p>
                            <div className="mt-auto">
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(news.published_date || news.created_at)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {publicNews.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    onClick={goToPrevious}
                    style={{
                      position: 'absolute',
                      left: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      color: 'white'
                    }}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    onClick={goToNext}
                    style={{
                      position: 'absolute',
                      right: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      color: 'white'
                    }}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            {/* Carousel Indicators */}
            {publicNews.length > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <div className="carousel-indicators d-flex gap-2">
                  {publicNews.map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm ${index === currentSlide ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => goToSlide(index)}
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%',
                        padding: 0
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .public-carousel-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
        }
        
        .public-carousel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .card-img-top-container {
          border-radius: 8px 8px 0 0;
        }
        
        .latest-public-carousel {
          padding: 2rem 0;
        }
        
        .carousel-container {
          overflow: hidden;
        }
        
        .carousel-inner {
          width: 100%;
        }
        
        .carousel-item {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default LatestPublicCarousel;
