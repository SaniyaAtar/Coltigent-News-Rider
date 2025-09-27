import React, { useState } from 'react';
import { useRealTimeTrending } from '../hooks/useRealTimeTrending';
import type { TrendingNewsResponse } from '../types/api';

interface TrendingNewsAPIProps {
  className?: string;
}

const TrendingNewsAPI: React.FC<TrendingNewsAPIProps> = ({ className = "" }) => {
  const [showLiveIndicator] = useState(true);
  
  const {
    trendingNews,
    isConnected,
    isSimulating,
    connectionState,
    lastUpdate,
    connect,
    disconnect,
    startSimulation,
    stopSimulation,
    refreshData,
    loading,
    error,
  } = useRealTimeTrending({
    autoConnect: true,
    autoStartSimulation: true,
    onError: (error) => {
      console.error('Real-time error:', error);
    },
  });

  // Get top trending articles (first 6)
  const topTrending = trendingNews.slice(0, 6);

  const handleReadMore = (article: TrendingNewsResponse) => {
    if (article.read_more_url) {
      window.open(article.read_more_url, '_blank');
    } else {
      // Navigate to article detail page
      window.location.href = `/trending/${article.id}`;
    }
  };

  if (loading) {
    return (
      <div className={`trending-news-api ${className}`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading trending articles...</p>
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
      <div className={`trending-news-api ${className}`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    <h6 className="alert-heading mb-1">Error Loading Articles</h6>
                    <p className="mb-0">{error}</p>
                  </div>
                </div>
                <hr />
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trendingNews.length === 0 && !loading) {
    return (
      <div className={`trending-news-api ${className}`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-newspaper display-1 text-muted mb-3"></i>
                <h5 className="text-muted">No Trending Articles Found</h5>
                <p className="text-muted">Check back later for the latest trending news.</p>
                <button className="btn btn-primary" onClick={refreshData}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`trending-news-api ${className}`}>
      <div className="container-fluid">
        {/* Real-time Status Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className={`me-3 ${isConnected ? 'text-success' : 'text-danger'}`}>
                        <i className={`bi ${isConnected ? 'bi-wifi' : 'bi-wifi-off'} fs-4`}></i>
                      </div>
                      <div>
                        <h6 className="mb-1">
                          {isConnected ? 'Connected' : 'Disconnected'} 
                          {isSimulating && <span className="badge bg-danger ms-2">LIVE</span>}
                        </h6>
                        <small className="text-muted">
                          Status: {connectionState} | 
                          {lastUpdate && ` Last update: ${new Date(lastUpdate).toLocaleTimeString()}`}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="btn-group" role="group">
                      <button 
                        className={`btn btn-sm ${isConnected ? 'btn-outline-danger' : 'btn-success'}`}
                        onClick={isConnected ? disconnect : connect}
                        disabled={loading}
                      >
                        <i className={`bi ${isConnected ? 'bi-x-circle' : 'bi-play-circle'} me-1`}></i>
                        {isConnected ? 'Disconnect' : 'Connect'}
                      </button>
                      <button 
                        className={`btn btn-sm ${isSimulating ? 'btn-outline-warning' : 'btn-warning'}`}
                        onClick={isSimulating ? stopSimulation : startSimulation}
                        disabled={!isConnected || loading}
                      >
                        <i className={`bi ${isSimulating ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>
                        {isSimulating ? 'Stop Live' : 'Start Live'}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={refreshData}
                        disabled={loading}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Trending Section */}
        {topTrending.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex align-items-center mb-4">
                <h3 className="mb-0">
                  <i className="bi bi-fire text-danger me-2"></i>
                  Top Trending
                </h3>
                {isSimulating && showLiveIndicator && (
                  <div className="ms-3">
                    <span className="badge bg-danger animate-pulse">
                      <i className="bi bi-broadcast me-1"></i>
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              <div className="row g-3">
                {topTrending.map((article) => (
                  <div key={article.id} className="col-lg-4 col-md-6">
                    <div className="card h-100 shadow-sm border-0 trending-article-card">
                      <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
                        {article.image_url ? (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="card-img-top w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://picsum.photos/400/200?random=${article.id}`;
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
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          {article.trending_score && (
                            <span className="badge bg-success me-2">
                              Score: {article.trending_score}
                            </span>
                          )}
                          {article.is_live && (
                            <span className="badge bg-danger animate-pulse">
                              <i className="bi bi-broadcast me-1"></i>
                              LIVE
                            </span>
                          )}
                        </div>
                        <h5 className="card-title fw-bold mb-3" style={{ 
                          fontSize: '1.1rem',
                          lineHeight: '1.3',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          color: '#0d9488'
                        }}>
                          {article.title}
                        </h5>
                        <p className="card-text text-muted flex-grow-1" style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.description}
                        </p>
                        <div className="mt-auto">
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => handleReadMore(article)}
                            style={{ fontSize: '0.9rem' }}
                          >
                            <i className="bi bi-arrow-right me-1"></i>
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Trending News */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h3>
              <i className="bi bi-newspaper text-primary me-2"></i>
              All Trending News
              {isSimulating && (
                <span className="badge bg-danger ms-2 animate-pulse">
                  <i className="bi bi-broadcast me-1"></i>
                  LIVE UPDATES
                </span>
              )}
            </h3>
            <div className="text-muted">
              <small>
                {trendingNews.length} articles | 
                {lastUpdate && ` Updated: ${new Date(lastUpdate).toLocaleTimeString()}`}
              </small>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {trendingNews.map((article) => (
            <div key={article.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-sm border-0 trending-article-card">
                {/* Article Image */}
                <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/400/200?random=${article.id}`;
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
                  <h5 className="card-title fw-bold mb-3" style={{ 
                    fontSize: '1.1rem',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.title}
                  </h5>

                  {/* Article Description */}
                  <p className="card-text text-muted flex-grow-1" style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.description}
                  </p>

                  {/* Article Meta */}
                  <div className="mt-3">
                    {article.author && (
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-person me-1"></i>
                        {article.author}
                      </small>
                    )}
                    {article.views_count && (
                      <small className="text-muted d-block mb-2">
                        <i className="bi bi-eye me-1"></i>
                        {article.views_count} views
                      </small>
                    )}
                  </div>

                  {/* Read More Button */}
                  <div className="mt-auto">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleReadMore(article)}
                      style={{ fontSize: '0.9rem' }}
                    >
                      <i className="bi bi-arrow-right me-1"></i>
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Info */}
        {isSimulating && (
          <div className="row mt-4">
            <div className="col-12 text-center">
              <div className="alert alert-info border-0">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Live Updates Active:</strong> New articles and score changes are being updated in real-time.
                {lastUpdate && (
                  <span className="ms-2">
                    Last update: {new Date(lastUpdate).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        .trending-article-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
        }
        
        .trending-article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .card-img-top-container {
          border-radius: 8px 8px 0 0;
        }
        
        .trending-news-api {
          padding: 2rem 0;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        
        .live-indicator {
          position: relative;
          overflow: hidden;
        }
        
        .live-indicator::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TrendingNewsAPI;
