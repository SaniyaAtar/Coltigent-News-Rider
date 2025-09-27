import React from "react";
import { useParams } from "react-router-dom";

const NewsDetailPage: React.FC = () => {
    const { id } = useParams();

    // Mock news data for now
    const news = {
        id: id ? parseInt(id) : 1,
        title: `News Article ${id || 1}`,
        description: "This is a detailed description of the news article. It provides more context and information about the topic.",
        content: "<p>This is the full content of the news article. It contains detailed information about the topic being discussed.</p><p>Additional paragraphs and content would go here to provide comprehensive coverage of the news story.</p>",
        image: "https://via.placeholder.com/800x400",
        author: "News Reporter",
        published_at: new Date().toISOString(),
        views_count: 1250,
        tags: ["news", "breaking", "important"]
    };

    return (
        <div className="container my-4">
            <article className="news-article">
                <header className="mb-4">
                    <h1 className="display-6 mb-3">{news.title}</h1>
                    {news.image && (
                        <img 
                            src={news.image} 
                            className="img-fluid rounded mb-3" 
                            alt={news.title}
                            loading="lazy"
                        />
                    )}
                    <div className="text-muted small mb-3">
                        {news.author && <span>By {news.author} • </span>}
                        {news.published_at && (
                            <span>{new Date(news.published_at).toLocaleDateString()} • </span>
                        )}
                        {news.views_count && <span>{news.views_count} views</span>}
                    </div>
                </header>
                
                <div className="news-content">
                    <p className="lead mb-4">{news.description}</p>
                    {news.content && (
                        <div 
                            className="news-body"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    )}
                </div>

                {news.tags && news.tags.length > 0 && (
                    <footer className="mt-4 pt-3 border-top">
                        <div className="tags">
                            <strong>Tags: </strong>
                            {news.tags.map((tag, index) => (
                                <span key={index} className="badge bg-secondary me-1">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </footer>
                )}
            </article>
        </div>
    );
};

export default NewsDetailPage;
