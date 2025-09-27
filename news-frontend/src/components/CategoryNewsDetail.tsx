import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { cachedTrendingApi, trendingApiService } from "../services/trendingApi";
// Removed unused import
import TrendingNews from "./TrendingNews";
import type { TrendingNewsResponse } from "../types/api";

const CategoryNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Removed unused navigate variable
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

  // Fetch news data from API
  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) {
        setError("Article ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from the trending news API
        // We'll fetch a larger set and find the specific article by ID
        const articles = await cachedTrendingApi.getLatestTrendingNews(100);
        const articleData = articles.find(article => article.id === parseInt(id));
        
        if (articleData) {
          setNews(articleData);
        } else {
          // If not found in trending news, try to get from category-specific news
          // We'll need to try different categories
          const categories = ['national', 'world', 'sports', 'business', 'education', 'local', 'health', 'technology', 'entertainment', 'politics', 'science', 'environment'];
          
          for (const category of categories) {
            try {
              const categoryArticles = await trendingApiService.getTrendingNewsByCategory(category, 1, 50);
              const foundArticle = categoryArticles.find(article => article.id === parseInt(id));
              if (foundArticle) {
                setNews(foundArticle);
                return;
              }
            } catch (categoryError) {
              console.warn(`Failed to fetch from ${category} category:`, categoryError);
            }
          }
          
          // If still not found, show error
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Failed to load article details');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading news detail...</h5>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h4>News Not Found</h4>
          <p className="text-muted">The requested news article could not be found.</p>
          <Link to="/" className="btn btn-primary">
            Back
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
              src={news.image_url || "https://via.placeholder.com/800x400?text=No+Image"}
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
                <small className="text-muted">
                  {news.published_at ? new Date(news.published_at).toLocaleDateString() : 
                   news.created_at ? new Date(news.created_at).toLocaleDateString() : 'Unknown date'}
                </small>
              </div>
              <h1 className="card-title mb-3" style={{ color: "#800000", fontSize: "2rem", lineHeight: "1.2" }}>
                {news.title}
              </h1>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">By {news.author || 'Unknown'}</small>
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
            <TrendingNews limit={8} compact={true} showViewMore={false} title="News" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewsDetail;
