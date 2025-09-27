import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cachedNewsApi } from "../services/newsApi";
import type { TrendingNewsResponse } from "../types/api";

interface NewsFeedProps {
  category?: string;
  limit?: number;
  showHeader?: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ 
  category, 
  limit = 8, 
  showHeader = true 
}) => {
  const [newsData, setNewsData] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let latestNewsData: TrendingNewsResponse[];
        
        if (category && category !== 'general') {
          // Fetch category-specific news
          console.log(`NewsFeed: Fetching ${category} category news`);
          const { trendingApiService } = await import("../services/trendingApi");
          latestNewsData = await trendingApiService.getTrendingNewsByCategory(category, 1, limit * 2);
          
          // Additional client-side filtering to ensure no mixing
          latestNewsData = latestNewsData.filter(article => 
            article.category && 
            article.category.toLowerCase() === category.toLowerCase()
          );
          
          // Limit the results
          latestNewsData = latestNewsData.slice(0, limit);
          console.log(`NewsFeed: Found ${latestNewsData.length} articles for ${category} category`);
        } else {
          // Fetch remaining breaking news (excluding top 3) for latest section
          latestNewsData = await cachedNewsApi.getRemainingBreakingNewsForLatest(3, limit);
        }
        
        setNewsData(latestNewsData);
      } catch (err) {
        console.error('Error fetching latest news:', err);
        setError('Failed to load latest news');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: TrendingNewsResponse[] = [
          {
            id: 4,
            title: "Medical Breakthrough Offers Hope for Rare Disease Patients",
            description: "Researchers have developed a new treatment that shows promising results for patients with previously untreatable conditions.",
            content: "Researchers have developed a new treatment that shows promising results for patients with previously untreatable conditions. The breakthrough could help thousands of patients worldwide.",
            image_url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=300&fit=crop&crop=center",
            published_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Health News",
            source: "Health News",
            read_more_url: "https://example.com/news/4",
            is_breaking: true,
            is_trending: true,
            trending_score: 75,
            trending_rank: 4,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 5,
            title: "Space Mission Successfully Lands on Distant Planet",
            description: "A historic space exploration mission has achieved a successful landing on a planet in another solar system.",
            content: "A historic space exploration mission has achieved a successful landing on a planet in another solar system. This marks a major milestone in space exploration.",
            image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=300&fit=crop&crop=center",
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Science News",
            source: "Science News",
            read_more_url: "https://example.com/news/5",
            is_breaking: true,
            is_trending: true,
            trending_score: 70,
            trending_rank: 5,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 6,
            title: "Economic Recovery Shows Strong Growth Indicators",
            description: "Latest economic data reveals positive trends across multiple sectors, signaling a robust recovery.",
            content: "Latest economic data reveals positive trends across multiple sectors, signaling a robust recovery. Experts are optimistic about continued growth.",
            image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop&crop=center",
            published_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Business News",
            source: "Business News",
            read_more_url: "https://example.com/news/6",
            is_breaking: true,
            is_trending: true,
            trending_score: 65,
            trending_rank: 6,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 7,
            title: "Cultural Festival Celebrates Diversity and Unity",
            description: "A week-long cultural festival has brought together communities from around the world to celebrate shared values.",
            content: "A week-long cultural festival has brought together communities from around the world to celebrate shared values. The event promotes understanding and cooperation.",
            image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop&crop=center",
            published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Culture News",
            source: "Culture News",
            read_more_url: "https://example.com/news/7",
            is_breaking: true,
            is_trending: true,
            trending_score: 60,
            trending_rank: 7,
            is_live: true,
            last_updated: new Date().toISOString(),
          },
          {
            id: 8,
            title: "Environmental Conservation Project Shows Remarkable Results",
            description: "A five-year conservation initiative has successfully restored ecosystems and protected endangered species.",
            content: "A five-year conservation initiative has successfully restored ecosystems and protected endangered species. The project serves as a model for future conservation efforts.",
            image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop&crop=center",
            published_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hours ago
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "breaking",
            author: "Environment News",
            source: "Environment News",
            read_more_url: "https://example.com/news/8",
            is_breaking: true,
            is_trending: true,
            trending_score: 55,
            trending_rank: 8,
            is_live: true,
            last_updated: new Date().toISOString(),
          }
        ];
        setNewsData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, [category, limit]);

  // Get section title based on category
  const getSectionTitle = () => {
    if (category) {
      return category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 'Latest News';
    }
    return 'Latest News';
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        {showHeader && (
          <div className="row mb-2">
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <div className="section-icon latest-icon me-3">
                  <i className="bi bi-newspaper"></i>
                </div>
                <div>
                  <h3 className="section-title mb-0">{getSectionTitle()}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading {getSectionTitle().toLowerCase()}...</h5>
        </div>
      </div>
    );
  }

  // No articles available state
  if (!loading && !error && newsData.length === 0) {
    const displayName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'News';
    
    return (
      <div className="container-fluid">
        {showHeader && (
          <div className="row mb-2">
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <div className="section-icon latest-icon me-3">
                  <i className="bi bi-newspaper"></i>
                </div>
                <div>
                  <h3 className="section-title mb-0">{getSectionTitle()}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>No {displayName} articles available</strong> at the moment. Please check back later or try a different category.
        </div>
      </div>
    );
  }

  // Error state (with fallback data)
  if (error && newsData.length === 0) {
    return (
      <div className="container-fluid">
        {showHeader && (
          <div className="row mb-2">
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <div className="section-icon latest-icon me-3">
                  <i className="bi bi-newspaper"></i>
                </div>
                <div>
                  <h3 className="section-title mb-0">{getSectionTitle()}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
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

  return (
    <div className="container-fluid">
      {/* Latest News Section Header */}
      {showHeader && (
        <div className="row mb-2">
          <div className="col-12">
            <div className="d-flex align-items-center mb-2">
              <div className="section-icon latest-icon me-3">
                <i className="bi bi-newspaper"></i>
              </div>
              <div>
                <h3 className="section-title mb-0">{getSectionTitle()}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Alert (if showing fallback data) */}
      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}. Showing cached data.
        </div>
      )}
      
      <div className="row g-1">
      {newsData.map((news, index) => (
        <div key={news.id || index} className="col-12 col-sm-6 col-lg-3 mb-1">
          <Link
            to={`/news/${news.id}`}
            className="text-decoration-none text-dark"
            style={{ display: "block" }}
          >
            <div className="card h-100 border-0 shadow-sm news-card-uniform" style={{ minHeight: "320px", borderRadius: "0" }}>
              <img
                src={news.image_url || "https://via.placeholder.com/600x300"}
                className="card-img-top"
                alt={news.title}
                loading="lazy"
                style={{ height: "200px", objectFit: "cover", width: "100%" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/600x300?text=No+Image";
                }}
              />
              <div className="card-body p-2 d-flex flex-column justify-content-between" style={{ minHeight: "120px" }}>
                <h6 className="news-card-title mb-1" style={{ minHeight: "2.6rem" }}>{news.title}</h6>
                <p className="news-card-text mb-0" style={{ minHeight: "2.8rem" }}>{news.description}</p>
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  {news.is_breaking && (
                    <span className="badge bg-danger" style={{ fontSize: "0.7rem" }}>
                      BREAKING
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  );
};

export default NewsFeed;