import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUserInfo, type CommunityReport } from "../services/communityReportsApi";
import "./PublicNews.css";

interface PublicNewsProps {
  initialLimit?: number;
  enableControls?: boolean;
  excludeId?: string | number;
}

const PublicNews: React.FC<PublicNewsProps> = ({ initialLimit = 10, enableControls = true, excludeId }) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(initialLimit);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { results } = await fetchUserInfo({ limit: 20, offset: 0, order_by: 'published_date', order_dir: 'desc' });
        setReports(results);
      } catch (err: any) {
        console.error('Error fetching community reports:', err);
        setError('Failed to load community reports');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleViewLess = () => {
    setVisibleCount(10);
  };

  if (loading) {
    return (
      <div className="public-news-container">
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <small className="text-muted">Loading public reports...</small>
        </div>
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className="public-news-container">
        <div className="alert alert-warning alert-sm mb-3" role="alert">
          <small>
            <i className="bi bi-exclamation-triangle me-1"></i>
            {error}
          </small>
        </div>
      </div>
    );
  }

  const filtered = excludeId == null ? reports : reports.filter(r => String(r.id) !== String(excludeId));
  const displayed = filtered.slice(0, Math.min(visibleCount, filtered.length));

  return (
    <div className="public-news-container">
      {error && (
        <div className="alert alert-warning alert-sm mb-3" role="alert">
          <small>
            <i className="bi bi-exclamation-triangle me-1"></i>
            {error}
          </small>
        </div>
      )}

      <div className="public-news-list">
        {displayed.map((item) => (
          <Link key={item.id} to={`/public-report/${item.id}`} className="text-decoration-none text-dark">
            <div className="public-news-item p-2 border-bottom" style={{ 
              cursor: "pointer",
              transition: "background-color 0.2s ease-in-out"
            }}>
              <div className="d-flex">
                <div className="flex-grow-1">

                  <h6 className="mb-1 public-headline" style={{ 
                    fontSize: "14px", 
                    lineHeight: "1.3"
                  }}>
                    {item.ai_headline}
                  </h6>

                  <p className="mb-0 public-summary">
                    {item.ai_summary}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {enableControls && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          {visibleCount < reports.length ? (
            <button className="btn btn-link p-0" onClick={handleViewMore}>More</button>
          ) : <span />}
          {visibleCount > initialLimit && (
            <button className="btn btn-link p-0" onClick={handleViewLess}>View less</button>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicNews;
