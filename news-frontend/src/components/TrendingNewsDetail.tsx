import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { trendingApiService } from "../services/trendingApi";
import type { TrendingNewsResponse } from "../types/api";
import TrendingNews from "./TrendingNews";

const TrendingNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<TrendingNewsResponse | null>(null);
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

  // Fetch article data
  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const articles = await trendingApiService.getLatestTrendingNews(50);
        const articleData = articles.find(article => article.id === parseInt(id || '0'));
        
        if (articleData) {
          setArticle(articleData);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article detail:', err);
        setError('Failed to load article details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading trending news detail...</h5>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h4>Trending News Not Found</h4>
          <p className="text-muted">The requested trending news article could not be found.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
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
          <div className="card shadow-sm border-0" style={{ borderRadius: "0" }}>
            <img
              src={article.image_url}
              alt={article.title}
              className="card-img-top"
              style={{ height: "400px", objectFit: "cover" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                  <span className="badge bg-secondary">{article.category}</span>
                  <span className="badge bg-danger">
                    <i className="bi bi-fire me-1"></i>
                    Trending #{article.trending_rank || 1}
                  </span>
                </div>
                <small className="text-muted">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Unknown date'}
                </small>
              </div>
              <h1 className="card-title mb-3" style={{ color: "#800000", fontSize: "2rem", lineHeight: "1.2" }}>
                {article.title}
              </h1>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">By {article.author}</small>
                {article.trending_score && (
                  <span className="badge bg-warning text-dark">
                    🔥 {article.trending_score}%
                  </span>
                )}
              </div>
              <div className="card-text" style={{ fontSize: "1.1rem", lineHeight: "1.6", textAlign: "justify" }}>
                {article.content ? article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                )) : (
                  <p className="mb-3">{article.description}</p>
                )}
              </div>
              
              {/* Bottom Navigation Buttons */}
              <div className="mt-4 d-flex align-items-center gap-2">
                <Link to="/" className="btn btn-outline-secondary">
                  Back
                </Link>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-share"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - 3 columns */}
        <div className="col-lg-3 col-md-4">
          {/* Trending News Section */}
          <div className="mb-4">
            <TrendingNews limit={8} compact={true} showViewMore={false} title="Trending News" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsDetail;
