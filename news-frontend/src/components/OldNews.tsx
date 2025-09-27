import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cachedNewsApi } from "../services/newsApi";
import type { TrendingNewsResponse } from "../types/api";

interface OldNewsProps {
  limit?: number;
  showViewMore?: boolean;
  showAll?: boolean;
}

const OldNews: React.FC<OldNewsProps> = ({ limit = 10, showViewMore: _showViewMore, showAll = false }) => {
  const [newsData, setNewsData] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(limit); // Initially show limit cards
  const [currentLimit, setCurrentLimit] = useState(limit); // Track current API limit

  useEffect(() => {
    const fetchPopularNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch popular news from trending_news table with category=popular
        const popularNewsData = await cachedNewsApi.getPopularNewsFromTrending(currentLimit);
        
        setNewsData(popularNewsData);
      } catch (err) {
        console.error('Error fetching popular news:', err);
        setError('Failed to load popular news');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: TrendingNewsResponse[] = [
    { 
      id: 1, 
      title: "Historic Election Results Shake Political Landscape", 
            description: "In a historic turn of events, the recent election results have completely reshaped the political landscape.",
            content: "In a historic turn of events, the recent election results have completely reshaped the political landscape. The unexpected outcomes have left analysts and citizens alike in awe of the democratic process.",
            image_url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-15T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Politics News",
            source: "Politics News",
            read_more_url: "https://example.com/news/1",
            is_breaking: false,
            is_trending: true,
            trending_score: 85,
            trending_rank: 1,
            is_live: false,
            last_updated: new Date().toISOString(),
    },
    { 
      id: 2, 
      title: "Major Economic Policy Changes Announced", 
            description: "The government has announced sweeping economic policy changes that are expected to impact millions of citizens.",
            content: "The government has announced sweeping economic policy changes that are expected to impact millions of citizens. These reforms aim to address long-standing issues in the financial sector while promoting sustainable growth and development.",
            image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-14T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Economy News",
            source: "Economy News",
            read_more_url: "https://example.com/news/2",
            is_breaking: false,
            is_trending: true,
            trending_score: 80,
            trending_rank: 2,
            is_live: false,
            last_updated: new Date().toISOString(),
    },
    { 
      id: 3, 
      title: "Breakthrough in Medical Research", 
            description: "Scientists have made a groundbreaking discovery in medical research that could potentially revolutionize treatment for a major disease.",
            content: "Scientists have made a groundbreaking discovery in medical research that could potentially revolutionize treatment for a major disease. The findings, published in a leading medical journal, have generated excitement in the scientific community.",
            image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-13T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Health News",
            source: "Health News",
            read_more_url: "https://example.com/news/3",
            is_breaking: false,
            is_trending: true,
            trending_score: 75,
            trending_rank: 3,
            is_live: false,
            last_updated: new Date().toISOString(),
    },
    { 
      id: 4, 
      title: "Sports Championship Ends in Dramatic Fashion", 
            description: "The championship game concluded in the most dramatic fashion possible, with the winning team securing victory in the final seconds.",
            content: "The championship game concluded in the most dramatic fashion possible, with the winning team securing victory in the final seconds. Fans are still talking about the incredible plays and the emotional rollercoaster of the match.",
            image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-12T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Sports News",
            source: "Sports News",
            read_more_url: "https://example.com/news/4",
            is_breaking: false,
            is_trending: true,
            trending_score: 70,
            trending_rank: 4,
            is_live: false,
            last_updated: new Date().toISOString(),
    },
    { 
      id: 5, 
      title: "Technology Innovation Changes Industry Standards", 
            description: "A new technological innovation has emerged that is set to change industry standards across multiple sectors.",
            content: "A new technological innovation has emerged that is set to change industry standards across multiple sectors. The breakthrough combines artificial intelligence with sustainable practices to create solutions for modern challenges.",
            image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-11T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Technology News",
            source: "Technology News",
            read_more_url: "https://example.com/news/5",
            is_breaking: false,
            is_trending: true,
            trending_score: 65,
            trending_rank: 5,
            is_live: false,
            last_updated: new Date().toISOString(),
    },
    { 
      id: 6, 
      title: "Environmental Conservation Efforts Show Results", 
            description: "Recent environmental conservation efforts have begun to show positive results, with measurable improvements in air quality and wildlife populations.",
            content: "Recent environmental conservation efforts have begun to show positive results, with measurable improvements in air quality and wildlife populations. The success of these initiatives provides hope for future environmental protection measures.",
            image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center",
            published_at: "2024-01-10T10:00:00Z",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "popular",
            author: "Environment News",
            source: "Environment News",
            read_more_url: "https://example.com/news/6",
            is_breaking: false,
            is_trending: true,
            trending_score: 60,
            trending_rank: 6,
            is_live: false,
            last_updated: new Date().toISOString(),
          }
        ];
        setNewsData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularNews();
  }, [currentLimit]);

  // Handle toggle button click
  const handleToggleView = () => {
    if (visibleCards < newsData.length) {
      // Show more - increase API limit and fetch more data
      const newLimit = Math.min(currentLimit + 10, 20); // Max 20 articles
      setCurrentLimit(newLimit);
      setVisibleCards(newLimit);
    } else {
      // Show less (back to initial amount)
      setVisibleCards(limit);
      setCurrentLimit(limit);
    }
  };

  // Check if we can show more
  const hasMoreNews = visibleCards < newsData.length && currentLimit < 20;
  
  // Check if we can show less (more than initial amount)
  const canShowLess = visibleCards > limit;
  
  // Determine button text and icon
  const buttonText = hasMoreNews ? "View More" : "View Less";
  const buttonIcon = hasMoreNews ? "bi-arrow-down-circle" : "bi-arrow-up-circle";
  const buttonClass = hasMoreNews ? "btn-outline-primary" : "btn-outline-secondary";

  // Get displayed news based on current state
  const displayedNews = showAll ? newsData : newsData.slice(0, visibleCards);

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid my-4">
        {/* Popular News Section Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <div className="section-icon popular-icon me-3">
                <i className="bi bi-star-fill"></i>
              </div>
              <div>
                <h3 className="section-title mb-0">Popular News</h3>
                <small className="section-subtitle text-muted">Most read and trending articles</small>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading popular news...</h5>
        </div>
      </div>
    );
  }

  // Error state (with fallback data)
  if (error && newsData.length === 0) {
    return (
      <div className="container-fluid my-4">
        {/* Popular News Section Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <div className="section-icon popular-icon me-3">
                <i className="bi bi-star-fill"></i>
              </div>
              <div>
                <h3 className="section-title mb-0">Popular News</h3>
                <small className="section-subtitle text-muted">Most read and trending articles</small>
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-warning"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no news available at all
  if (newsData.length === 0) {
    return (
      <div className="container-fluid my-4">
        {/* Popular News Section Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <div className="section-icon popular-icon me-3">
                <i className="bi bi-star-fill"></i>
              </div>
              <div>
                <h3 className="section-title mb-0">Popular News</h3>
                <small className="section-subtitle text-muted">Most read and trending articles</small>
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No popular news available at the moment.
        </div>
      </div>
    );
  }

  // Split news into rows: first row 3 cards, then 6 cards per row
  const firstRow = displayedNews.slice(0, 3);
  const remainingNews = displayedNews.slice(3);
  const otherRows = [];
  for (let i = 0; i < remainingNews.length; i += 6) {
    otherRows.push(remainingNews.slice(i, i + 6));
  }

  return (
    <div className="container-fluid my-4">
      {/* Popular News Section Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <div className="section-icon popular-icon me-3">
              <i className="bi bi-star-fill"></i>
            </div>
            <div>
              <h3 className="section-title mb-0">Popular News</h3>
              <small className="section-subtitle text-muted">Most read and trending articles</small>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert (if showing fallback data) */}
      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}. Showing cached data.
        </div>
      )}

      {/* First row - 3 cards */}
        <div className="row g-3 mb-3">
          {firstRow.map((news) => (
            <div key={news.id} className="col-lg-4 col-md-6 col-sm-6 col-12">
              <Link to={`/old-news/${news.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "0" }}>
                  {news.image_url ? (
                  <img
                    src={news.image_url}
                    className="card-img-top"
                    alt={news.title}
                    style={{ height: "150px", objectFit: "cover" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="height: 150px; background: linear-gradient(135deg, #6c757d20 0%, #6c757d40 100%);">
                            <i class="bi bi-newspaper text-muted" style="font-size: 2rem;"></i>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div 
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ 
                      height: "150px", 
                      background: "linear-gradient(135deg, #6c757d20 0%, #6c757d40 100%)" 
                    }}
                  >
                    <i className="bi bi-newspaper text-muted" style={{ fontSize: "2rem" }}></i>
                  </div>
                )}
                  <div className="card-body p-3">
                  <h6 className="card-title mb-2" style={{ fontSize: "0.9rem", lineHeight: "1.3" }}>
                    {news.title}
                  </h6>
                  <p className="card-text text-muted small mb-2" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                    {news.description}
                  </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      {/* Other rows - 6 cards each */}
      {otherRows.map((row, rowIndex) => (
        <div key={rowIndex} className="row g-3 mb-3">
          {row.map((news) => (
            <div key={news.id} className="col-lg-2 col-md-4 col-sm-6 col-6">
            <Link to={`/old-news/${news.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "0" }}>
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    className="card-img-top"
                    alt={news.title}
                    style={{ height: "100px", objectFit: "cover" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="height: 100px; background: linear-gradient(135deg, #6c757d20 0%, #6c757d40 100%);">
                            <i class="bi bi-newspaper text-muted" style="font-size: 1.5rem;"></i>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div 
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ 
                      height: "100px", 
                      background: "linear-gradient(135deg, #6c757d20 0%, #6c757d40 100%)" 
                    }}
                  >
                    <i className="bi bi-newspaper text-muted" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                )}
                <div className="card-body p-2 text-center">
                    <p className="small fw-semibold mb-1" style={{ fontSize: "0.8rem", lineHeight: "1.2" }}>
                      {news.title}
                    </p>
                  </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      ))}

      {/* Toggle View Button - only show on home page when not showing all */}
      {!showAll && (hasMoreNews || canShowLess) && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <button 
              className={`btn ${buttonClass} toggle-view-btn`}
              onClick={handleToggleView}
            >
              <i className={`bi ${buttonIcon} me-2`}></i>
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OldNews;