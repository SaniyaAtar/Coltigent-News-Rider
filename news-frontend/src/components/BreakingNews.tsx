import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cachedNewsApi } from "../services/newsApi";
import type { TrendingNewsResponse } from "../types/api";

// Removed unused NewsItem interface


const BreakingNews: React.FC = () => {
  const [news, setNews] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch breaking news from trending_news table with category=breaking
        const breakingNewsData = await cachedNewsApi.getBreakingNewsFromTrending(3);
        
        setNews(breakingNewsData);
      } catch (err) {
        console.error('Error fetching breaking news:', err);
        setError('Failed to load breaking news');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: TrendingNewsResponse[] = [
          {
            id: 1,
            title: "Major Economic Policy Changes Announced by Government",
            description: "The government has announced significant changes to economic policies that will affect millions of citizens across the country.",
            content: "The government has announced significant changes to economic policies that will affect millions of citizens across the country. These changes include new tax reforms, infrastructure investments, and social welfare programs.",
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Government News",
            source: "Government News",
            read_more_url: "https://example.com/news/1",
            is_breaking: true,
            is_trending: true,
            trending_score: 95,
            trending_rank: 1,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Breakthrough in Renewable Energy Technology",
            description: "Scientists have achieved a major breakthrough in solar panel efficiency, potentially revolutionizing clean energy.",
            content: "Scientists have achieved a major breakthrough in solar panel efficiency, potentially revolutionizing clean energy. The new technology could increase efficiency by 40% and reduce costs significantly.",
            image_url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=300&fit=crop",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Science News",
            source: "Science News",
            read_more_url: "https://example.com/news/2",
            is_breaking: true,
            is_trending: true,
            trending_score: 88,
            trending_rank: 2,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 3,
            title: "World Climate Summit Reaches Historic Agreement",
            description: "World leaders have reached a historic agreement on climate change measures during the latest world summit.",
            content: "World leaders have reached a historic agreement on climate change measures during the latest world summit. The agreement includes new emission targets and funding commitments.",
            image_url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=300&fit=crop",
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "World News",
            source: "World News",
            read_more_url: "https://example.com/news/3",
            is_breaking: true,
            is_trending: true,
            trending_score: 82,
            trending_rank: 3,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
        ];
        setNews(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);


  if (loading) {
    return (
      <div className="container-fluid my-2">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Loading breaking news...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="container-fluid my-2">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayNews = news;

  // If no news available at all
  if (displayNews.length === 0) {
    return (
      <div className="container-fluid my-2">
        <div className="container">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No breaking news available at the moment.
          </div>
        </div>
      </div>
    );
  }



  const featuredNews = displayNews.slice(0, 1); // Top 1 news for large display
  const regularNews = displayNews.slice(1, 3); // Next 2 news for smaller display

  return (
    <div className="breaking-news-container">
      <div className="container-fluid">
        <div className="container">
          {/* Error Alert (if showing fallback data) */}
          {error && (
            <div className="alert alert-warning mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}. Showing cached data.
            </div>
          )}
          {/* Featured News Section - Single Large Card */}
          <div className="featured-news-section mb-4">
            <div className="row g-3">
          {featuredNews.map((item, index) => (
            <div key={item.id || index} className="col-12">
              <Link
                to={`/breaking-news/${item.id}`}
                className="text-decoration-none text-dark"
                style={{ display: "block" }}
                onClick={() => console.log('Breaking news card clicked:', item.id, item.title)}
              >
                <div className="featured-news-card">
                  <div className="featured-image-container">
                    <img 
                      src={item.image_url || `https://via.placeholder.com/600x300?text=No+Image`} 
                      alt={item.title}
                      className="featured-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/600x300?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="featured-content p-3">
                    <h5 className="featured-title">
                      {item.title}
                    </h5>
                    <p className="featured-description text-muted mb-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
            </div>
          </div>

          {/* Regular News Section - 2 Cards */}
          <div className="regular-news-section">
            <div className="row g-3">
          {regularNews.map((item, index) => (
            <div key={item.id || index} className="col-md-6">
              <Link
                to={`/breaking-news/${item.id}`}
                className="text-decoration-none text-dark"
                style={{ display: "block" }}
                onClick={() => console.log('Breaking news card clicked:', item.id, item.title)}
              >
                <div className="regular-news-card">
                  <div className="regular-image-container">
                    <img 
                      src={item.image_url || `https://via.placeholder.com/400x200?text=No+Image`} 
                      alt={item.title}
                      className="regular-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="regular-content p-3">
                    <h6 className="regular-title">
                      {item.title}
                    </h6>
                    <p className="regular-description text-muted mb-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
