import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { cachedNewsApi } from "../services/newsApi";
import type { TrendingNewsResponse } from "../types/api";
import TrendingNews from "./TrendingNews";

const BreakingNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<TrendingNewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  // Fetch breaking news data
  useEffect(() => {
    const fetchBreakingNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('BreakingNewsDetail: Fetching news for ID:', id);
        
        // Try to fetch from API first
        const breakingNewsData = await cachedNewsApi.getBreakingNewsFromTrending(10);
        const breakingNews = breakingNewsData.find(item => item.id === Number(id));
        
        if (breakingNews) {
          setNews(breakingNews);
        } else {
          // Fallback to hardcoded data if not found in API
          const fallbackData: TrendingNewsResponse[] = [
            {
              id: 1,
              title: "Major Economic Policy Changes Announced by Government",
              description: "The government has announced significant changes to economic policies that will affect millions of citizens across the country.",
              content: `The government has announced significant changes to economic policies that will affect millions of citizens across the country. These changes include new tax reforms, infrastructure investments, and social welfare programs.

The new economic policy framework focuses on three main pillars: fiscal responsibility, social equity, and sustainable growth. The government aims to reduce income inequality while maintaining economic stability.

Key highlights of the new policies include:
• Progressive tax reforms targeting high-income earners
• Increased investment in public infrastructure
• Enhanced social welfare programs for vulnerable populations
• Support for small and medium enterprises
• Green energy initiatives and environmental protection measures

The announcement comes after months of consultation with economists, business leaders, and civil society organizations. The government has emphasized that these changes are designed to create a more inclusive and sustainable economy.

Critics have raised concerns about the potential impact on economic growth, while supporters argue that the reforms are necessary to address long-standing social and economic challenges. The implementation timeline spans over the next three years, with gradual rollout of different policy components.

Financial markets have shown mixed reactions to the announcement, with some sectors experiencing volatility while others remain stable. The government has assured citizens that these changes will ultimately benefit the economy and improve living standards for all citizens.`,
              image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
              published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
              content: `Scientists have achieved a major breakthrough in solar panel efficiency, potentially revolutionizing clean energy. The new technology could increase efficiency by 40% and reduce costs significantly.

The breakthrough involves a new type of photovoltaic cell that uses advanced materials and innovative design principles. Researchers at leading universities and technology companies have been working on this development for over five years.

The new solar panels demonstrate several key advantages:
• 40% higher energy conversion efficiency
• Reduced manufacturing costs
• Better performance in low-light conditions
• Increased durability and lifespan
• Smaller footprint for the same energy output

This development comes at a critical time as the world seeks to transition to renewable energy sources. The technology could accelerate the adoption of solar power in both residential and commercial applications.

Industry experts predict that this breakthrough could reduce the cost of solar energy by up to 30% within the next two years. The technology is expected to be commercially available by 2026, with pilot projects already underway in several countries.

Environmental groups have welcomed the news, stating that this advancement could significantly contribute to global efforts to combat climate change. The technology also has potential applications in space exploration and remote power generation.

The research team plans to publish their findings in peer-reviewed journals and is working with manufacturers to scale up production. World energy organizations have expressed interest in supporting the commercialization of this technology.`,
              image_url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=400&fit=crop",
              published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
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
              content: `World leaders have reached a historic agreement on climate change measures during the latest world summit. The agreement includes new emission targets and funding commitments that could significantly impact global climate policy.

The summit, attended by representatives from over 190 countries, resulted in the most comprehensive climate agreement since the Paris Accord. The new framework sets ambitious targets for carbon emission reductions and establishes new mechanisms for world cooperation.

Key components of the agreement include:
• Commitment to achieve net-zero emissions by 2050
• $100 billion annual climate finance fund
• Enhanced support for developing countries
• New carbon trading mechanisms
• Strengthened monitoring and reporting systems

The agreement represents a significant step forward in world climate cooperation. Developed countries have committed to providing financial and technical support to developing nations to help them transition to clean energy.

Climate activists have praised the agreement while emphasizing the need for immediate action. The agreement includes specific timelines for implementation and regular review mechanisms to ensure progress.

The business community has also responded positively, with many companies announcing new sustainability initiatives in response to the agreement. The framework provides clear guidelines for corporate climate action and investment in green technologies.

Implementation of the agreement will require coordinated efforts across all sectors of society. Governments, businesses, and civil society organizations will need to work together to achieve the ambitious targets set forth in the agreement.

The next major milestone will be the implementation of national action plans, which are due within 12 months of the agreement's ratification.`,
              image_url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop",
              published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
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
          
          const fallbackNews = fallbackData.find(item => item.id === Number(id));
          if (fallbackNews) {
            setNews(fallbackNews);
          } else {
            setError('Breaking news not found');
          }
        }
      } catch (err) {
        console.error('Error fetching breaking news detail:', err);
        setError('Failed to load breaking news detail');
        
        // Fallback to hardcoded data
        const fallbackData: TrendingNewsResponse[] = [
          {
            id: 1,
            title: "Major Economic Policy Changes Announced by Government",
            description: "The government has announced significant changes to economic policies that will affect millions of citizens across the country.",
            content: "The government has announced significant changes to economic policies that will affect millions of citizens across the country. These changes include new tax reforms, infrastructure investments, and social welfare programs.",
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
        ];
        
        const fallbackNews = fallbackData.find(item => item.id === Number(id));
        if (fallbackNews) {
          setNews(fallbackNews);
        } else {
          setError('Breaking news not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBreakingNewsDetail();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>Loading breaking news...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !news) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <hr />
              <button 
                className="btn btn-outline-danger"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Breaking News Not Found</h4>
              <p>The requested breaking news article could not be found.</p>
              <hr />
              <button 
                className="btn btn-outline-warning"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid my-4">
      <div className="row g-4">
        {/* Main Content - 9 columns */}
        <div className="col-lg-9 col-md-8">
          <Link to="/" className="btn btn-outline-secondary mb-3">Back</Link>
          
          {/* Error Alert (if showing fallback data) */}
          {error && (
            <div className="alert alert-warning mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}. Showing cached data.
            </div>
          )}

          <div className="card shadow-sm border-0" style={{ borderRadius: "0" }}>
            {/* Article Image */}
            <img
              src={news.image_url}
              alt={news.title}
              className="card-img-top"
              style={{ height: "400px", objectFit: "cover" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-secondary">{news.category}</span>
                <small className="text-muted">
                  {news.published_at ? new Date(news.published_at).toLocaleDateString() : 'Unknown date'}
                </small>
              </div>
              
              <h1 className="card-title mb-3" style={{ color: "#800000", fontSize: "2rem", lineHeight: "1.2" }}>
                {news.title}
              </h1>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">By {news.author}</small>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary me-2">
                    <i className="bi bi-fire me-1"></i>
                    Trending Score: {news.trending_score}
                  </span>
                  <span className="badge bg-info">
                    <i className="bi bi-graph-up me-1"></i>
                    Rank #{news.trending_rank}
                  </span>
                </div>
              </div>

              <div className="card-text" style={{ fontSize: "1.1rem", lineHeight: "1.6", textAlign: "justify" }}>
                {news.content ? news.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                )) : (
                  <p className="mb-3">{news.description}</p>
                )}
              </div>
              
              {/* Bottom Navigation Buttons */}
              <div className="mt-4 d-flex align-items-center gap-2">
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back
                </Link>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: news.title,
                        text: news.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <i className="bi bi-share me-1"></i> Share
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => window.open(news.read_more_url, '_blank')}
                >
                  <i className="bi bi-box-arrow-up-right me-1"></i> Read More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - 3 columns */}
        <div className="col-lg-3 col-md-4">
          {/* Trending News Section */}
          <div className="mb-4">
            <TrendingNews limit={8} compact={true} showViewMore={false} title="More Breaking News" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsDetail;
