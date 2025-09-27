import React, { useEffect, useState } from "react";
import axios from "axios";

interface ArticleItem {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
  urlToImage?: string;
}

const LiveNews: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8000/api/v1/news/", {
          params: {
            page: 1,
            size: 10,
            published_only: true,
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.results)
          ? response.data.results
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setArticles(data as ArticleItem[]);
      } catch (err: unknown) {
        setError("Failed to load news");
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div>Loading news…</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  if (!articles.length) {
    return <div>No news found.</div>;
  }

  return (
    <div className="container my-3">
      <h5 className="fw-bold text-primary mb-2">Live API Demo</h5>
      <div className="row g-3">
        {articles.slice(0, 6).map((item, idx) => {
          const imageSrc = item.image || item.image_url || item.urlToImage || "https://via.placeholder.com/400x220";
          const title = item.title || "Untitled";
          const description = item.description || "";
          return (
            <div key={item.id ?? idx} className="col-12 col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={imageSrc}
                  className="card-img-top img-fluid"
                  alt={title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title mb-1">{title}</h6>
                  {description && (
                    <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveNews;



