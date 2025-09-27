import React from "react";
import { useLocation } from "react-router-dom";
import CategoryDisplay from "../components/CategoryDisplay";
import NewsCarousel from "../components/NewsCarousel";
import CategoryVideoNews from "../components/CategoryVideoNews";
import ErrorBoundary from "../components/ErrorBoundary";
import NationalArticleFallback from "../components/NationalArticleFallback";

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const layout = 'grid';
  
  // Extract category from URL path
  const category = location.pathname.replace('/', '') || 'trending';
  
  const categoryStyle = { color: '#6c757d', icon: 'bi-newspaper', bg: 'bg-secondary' };

  return (
    <main className="page-content category-page">
      <div className="container-fluid px-3 px-md-4 px-lg-5">

        <div className="row g-4">
          {/* Left Column - Main Content */}
          <div className="col-lg-8">
            {/* Latest News Carousel */}
            <div className="modern-section-card mb-4">
              <div className="section-header-modern" style={{ 
                background: `linear-gradient(135deg, ${categoryStyle.color}, ${categoryStyle.color}dd)`,
                color: 'white'
              }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="section-icon-modern" style={{ 
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <i className={`bi ${categoryStyle.icon}`}></i>
                    </div>
                    <div>
                      <h5 className="section-title mb-1">National News Headlines</h5>
                      <small className="section-subtitle-modern opacity-75">Trending national news with S3 images/videos</small>
                    </div>
                  </div>
                  <div className="live-indicator-modern">
                    <span className="badge bg-warning text-dark">
                      <i className="bi bi-trending-up me-1"></i>
                      TRENDING
                    </span>
                  </div>
                </div>
              </div>
              <div className="section-content-modern" style={{ 
                background: `linear-gradient(180deg, ${categoryStyle.color}08 0%, #ffffff 100%)`
              }}>
                <ErrorBoundary fallback={<NationalArticleFallback />}>
                  <NewsCarousel />
                </ErrorBoundary>
              </div>
            </div>

            {/* Category-specific News Section */}
            <div className="modern-section-card">
              <div className="section-header-modern" style={{ 
                background: `linear-gradient(135deg, ${categoryStyle.color}dd, ${categoryStyle.color}bb)`,
                color: 'white'
              }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="section-icon-modern" style={{ 
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <i className={`bi ${categoryStyle.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="section-title-modern mb-1">Featured Stories</h4>
                      <small className="section-subtitle-modern opacity-75">
                        {category === 'national' ? 'National news with S3 images/videos (excluding trending)' : 'In-depth coverage and analysis'}
                      </small>
                    </div>
                  </div>
                  <div className="live-indicator-modern">
                    <span className="badge bg-info">
                      <i className="bi bi-star me-1"></i>
                      FEATURED
                    </span>
                  </div>
                </div>
              </div>
              <div className="section-content-modern" style={{ 
                background: `linear-gradient(180deg, ${categoryStyle.color}05 0%, #ffffff 100%)`
              }}>
                <ErrorBoundary fallback={<div className="alert alert-info border-0 rounded-3">Category news temporarily unavailable</div>}>
                  <CategoryDisplay 
                    category={category}
                    layout={layout}
                    limit={20}
                    showHeader={false}
                    showFilters={true}
                    showViewMore={true}
                    apiMethod={category === 'national' ? 'excluding_trending' : 'default'}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="col-lg-4">
            {/* Video News Section */}
            <div className="modern-section-card mb-4">
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
                      <i className="bi bi-play-circle"></i>
                    </div>
                    <div>
                      <h4 className="section-title-modern mb-1">Video News</h4>
                      <small className="section-subtitle-modern opacity-75">Watch latest videos</small>
                    </div>
                  </div>
                  <div className="live-indicator-modern">
                    <span className="badge bg-danger">
                      <i className="bi bi-play me-1"></i>
                      VIDEO
                    </span>
                  </div>
                </div>
              </div>
              <div className="section-content-modern" style={{ 
                background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)'
              }}>
                <ErrorBoundary fallback={<div className="alert alert-info border-0 rounded-3">Video news temporarily unavailable</div>}>
                  <CategoryVideoNews />
                </ErrorBoundary>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
