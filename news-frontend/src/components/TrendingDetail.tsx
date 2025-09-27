import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface TrendingArticle {
  id: number;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  url?: string;
  author?: string;
  published_at?: string;
  category?: string;
  read_more_url?: string;
  hashtag?: string;
  tweets_count?: number;
}

const TrendingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<TrendingArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Article ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from the trending API first
        const response = await axios.get<TrendingArticle>(`http://localhost:8000/api/v1/trending/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article details');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: TrendingArticle = {
          id: parseInt(id),
          title: "Climate Summit 2025",
          description: "Global climate summit brings world leaders together to discuss urgent environmental policies and sustainable development goals.",
          content: `
            <p>The 2025 Climate Summit represents a pivotal moment in global environmental policy. World leaders from over 190 countries have gathered to address the most pressing climate challenges of our time.</p>
            
            <p>Key topics on the agenda include:</p>
            <ul>
              <li>Carbon emission reduction targets</li>
              <li>Renewable energy transition plans</li>
              <li>Climate adaptation strategies</li>
              <li>World climate finance</li>
            </ul>
            
            <p>The summit aims to build upon previous agreements and establish more ambitious targets for the next decade. Environmental experts are calling this the most important climate conference since the Paris Agreement.</p>
            
            <p>Several major announcements are expected during the three-day event, including new commitments from major economies and innovative solutions for climate mitigation.</p>
          `,
          image_url: "https://via.placeholder.com/800x400",
          url: "https://example.com/news/1",
          author: "Environmental News Team",
          published_at: "2025-01-27T10:00:00Z",
          category: "Environment",
          hashtag: "#ClimateSummit2025",
          tweets_count: 45600
        };
        setArticle(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
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
              <h5>Loading article...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !article) {
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
                onClick={() => navigate('/trending')}
              >
                Back to Trending
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Article Not Found</h4>
              <p>The requested article could not be found.</p>
              <hr />
              <button 
                className="btn btn-outline-warning"
                onClick={() => navigate('/trending')}
              >
                Back to Trending
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Back to Trending Link */}
          <div className="mb-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/trending')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Trending
            </button>
          </div>

          {/* Error Alert (if showing fallback data) */}
          {error && (
            <div className="alert alert-warning mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}. Showing cached data.
            </div>
          )}

          {/* Article Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-primary me-2">{article.category || "General"}</span>
              <span className="badge bg-danger bg-opacity-10 text-danger">
                🔥 Trending
              </span>
            </div>
            
            <h1 className="display-6 fw-bold mb-3">{article.title}</h1>
            
            {article.hashtag && (
              <p className="text-primary fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
                {article.hashtag}
              </p>
            )}
            
            <p className="lead text-muted mb-4">{article.description}</p>
            
            {/* Article Meta */}
            <div className="d-flex flex-wrap align-items-center text-muted mb-4">
              {article.author && (
                <span className="me-4">
                  <i className="bi bi-person me-1"></i>
                  {article.author}
                </span>
              )}
              {article.published_at && (
                <span className="me-4">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {article.tweets_count && (
                <span className="me-4">
                  <i className="bi bi-twitter me-1"></i>
                  {article.tweets_count.toLocaleString()} mentions
                </span>
              )}
            </div>
          </div>

          {/* Article Image */}
          {article.image_url && (
            <div className="mb-4">
              <img
                src={article.image_url}
                alt={article.title}
                className="img-fluid rounded shadow"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/800/400?random=${article.id}`;
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content mb-5">
            {article.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.7',
                  color: '#333'
                }}
              />
            ) : (
              <div style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.7',
                color: '#333'
              }}>
                <p>{article.description}</p>
                <p>This is a trending article that has gained significant attention across social media platforms. The content continues to evolve as more information becomes available.</p>
                <p>Stay tuned for updates as this story develops and more details emerge from official sources.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-3 mb-5">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.description,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <i className="bi bi-share me-2"></i>
              Share
            </button>
            
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/trending')}
            >
              <i className="bi bi-fire me-2"></i>
              More Trending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingDetail;
