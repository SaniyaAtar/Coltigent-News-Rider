import React from 'react';
import { useTrendingNews, useTopTrendingNews } from '../hooks/useTrendingNews';

// Example component showing how to use the new trending news API
export const TrendingNewsExample: React.FC = () => {
  const {
    trendingNews,
    categories,
    loading,
    error,
    refresh,
    refreshTrending,
    hasMore,
    loadMore,
  } = useTrendingNews({
    limit: 10,
    useCache: true,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  });

  const {
    topTrending,
    loading: topLoading,
    error: topError,
    refresh: refreshTop,
  } = useTopTrendingNews(5);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <hr />
        <button className="btn btn-outline-danger" onClick={refresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Trending News</h2>
            <div>
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={refresh}
                disabled={loading}
              >
                Refresh
              </button>
              <button 
                className="btn btn-outline-success" 
                onClick={refreshTrending}
                disabled={loading}
              >
                Manual Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Trending News */}
      <div className="row mb-4">
        <div className="col-12">
          <h3>Top Trending</h3>
          {topLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : topError ? (
            <div className="alert alert-warning">
              <p>{topError}</p>
              <button className="btn btn-sm btn-outline-warning" onClick={refreshTop}>
                Retry
              </button>
            </div>
          ) : (
            <div className="row">
              {topTrending.map((news) => (
                <div key={news.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    {news.image_url && (
                      <img
                        src={news.image_url}
                        className="card-img-top" 
                        alt={news.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{news.title}</h5>
                      <p className="card-text flex-grow-1">{news.description}</p>
                      <div className="mt-auto">
                        {news.category && (
                          <span className="badge bg-primary me-2">{news.category}</span>
                        )}
                        {news.trending_score && (
                          <span className="badge bg-success">
                            Score: {news.trending_score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Categories */}
      <div className="row mb-4">
        <div className="col-12">
          <h3>Trending Categories</h3>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <span 
                key={category.id} 
                className="badge bg-secondary"
                style={{ backgroundColor: category.color }}
              >
                {category.name} ({category.trending_count || 0})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* All Trending News */}
      <div className="row">
        <div className="col-12">
          <h3>All Trending News</h3>
          <div className="row">
            {trendingNews.map((news) => (
              <div key={news.id} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                    {news.image_url && (
                      <img
                        src={news.image_url}
                      className="card-img-top" 
                      alt={news.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{news.title}</h5>
                    <p className="card-text flex-grow-1">{news.description}</p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {news.category && (
                            <span className="badge bg-primary me-2">{news.category}</span>
                          )}
                          {news.trending_rank && (
                            <span className="badge bg-warning">
                              #{news.trending_rank}
                            </span>
                          )}
                        </div>
                        <small className="text-muted">
                          {news.views_count || 0} views
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-primary" 
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsExample;

