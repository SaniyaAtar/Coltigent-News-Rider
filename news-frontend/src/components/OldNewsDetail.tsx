import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cachedNewsApi } from "../services/newsApi";
import type { TrendingNewsResponse } from "../types/api";
import TrendingNews from "./TrendingNews";

const oldNewsData = [
  { 
    id: 1, 
    title: "Historic Election Results Shake Political Landscape", 
    description: "In a historic turn of events, the recent election results have completely reshaped the political landscape. The unexpected outcomes have left analysts and citizens alike in awe of the democratic process and its ability to surprise even the most seasoned political observers.",
    content: `In a historic turn of events, the recent election results have completely reshaped the political landscape. The unexpected outcomes have left analysts and citizens alike in awe of the democratic process and its ability to surprise even the most seasoned political observers.

The election, which was held across multiple constituencies, saw unprecedented voter turnout and resulted in significant changes to the political composition of the government. Early exit polls had suggested a different outcome, but the final results revealed a completely different picture.

Political analysts are now scrambling to understand the factors that led to this dramatic shift. Some attribute it to last-minute campaign strategies, while others point to changing voter demographics and evolving political priorities among the electorate.

The newly elected representatives have already begun outlining their policy priorities, promising to address key issues that resonated with voters during the campaign. These include economic reforms, social welfare programs, and environmental protection measures.`,
    urlToImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop&crop=center",
    date: "2024-01-15",
    author: "Political Correspondent",
    category: "Politics"
  },
  { 
    id: 2, 
    title: "Major Economic Policy Changes Announced", 
    description: "The government has announced sweeping economic policy changes that are expected to impact millions of citizens. These reforms aim to address long-standing issues in the financial sector while promoting sustainable growth and development.",
    content: `The government has announced sweeping economic policy changes that are expected to impact millions of citizens. These reforms aim to address long-standing issues in the financial sector while promoting sustainable growth and development.

The comprehensive economic reform package includes measures to stimulate investment, create jobs, and improve the overall business environment. Key components of the policy include tax incentives for small and medium enterprises, infrastructure development projects, and support for emerging industries.

Financial experts have welcomed the announcement, noting that the reforms address many of the structural issues that have hindered economic growth in recent years. The policies are designed to create a more competitive and dynamic economy that can adapt to changing global conditions.`,
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&crop=center",
    date: "2024-01-14",
    author: "Economic Reporter",
    category: "Economy"
  },
  { 
    id: 3, 
    title: "Breakthrough in Medical Research", 
    description: "Scientists have made a groundbreaking discovery in medical research that could potentially revolutionize treatment for a major disease. The findings, published in a leading medical journal, have generated excitement in the scientific community.",
    content: `Scientists have made a groundbreaking discovery in medical research that could potentially revolutionize treatment for a major disease. The findings, published in a leading medical journal, have generated excitement in the scientific community.

The research, conducted over several years by a team of world scientists, focused on understanding the molecular mechanisms underlying a previously untreatable condition. The breakthrough involves a new therapeutic approach that targets specific cellular pathways.

Dr. Sarah Johnson, lead researcher on the project, explained that the discovery opens up new possibilities for treatment that were previously thought impossible. "This represents a paradigm shift in how we approach this particular disease," she said in a press conference.`,
    urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center",
    date: "2024-01-13",
    author: "Medical Correspondent",
    category: "Health"
  },
  { 
    id: 4, 
    title: "Sports Championship Ends in Dramatic Fashion", 
    description: "The championship game concluded in the most dramatic fashion possible, with the winning team securing victory in the final seconds. Fans are still talking about the incredible plays and the emotional rollercoaster of the match.",
    content: `The championship game concluded in the most dramatic fashion possible, with the winning team securing victory in the final seconds. Fans are still talking about the incredible plays and the emotional rollercoaster of the match.

The game, which was played in front of a sold-out stadium, lived up to all expectations and more. Both teams displayed exceptional skill and determination throughout the match, with the lead changing hands multiple times.

The decisive moment came in the final minute when the winning team executed a perfectly timed play that resulted in the championship-winning score. The crowd erupted in celebration as the players and coaching staff rushed onto the field.`,
    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&crop=center",
    date: "2024-01-12",
    author: "Sports Reporter",
    category: "Sports"
  },
  { 
    id: 5, 
    title: "Technology Innovation Changes Industry Standards", 
    description: "A new technological innovation has emerged that is set to change industry standards across multiple sectors. The breakthrough combines artificial intelligence with sustainable practices to create solutions for modern challenges.",
    content: `A new technological innovation has emerged that is set to change industry standards across multiple sectors. The breakthrough combines artificial intelligence with sustainable practices to create solutions for modern challenges.

The technology, developed by a startup company, uses advanced machine learning algorithms to optimize processes in manufacturing, healthcare, and environmental management. Early adopters have reported significant improvements in efficiency and cost reduction.

CEO Jennifer Chen explained that the innovation represents a new approach to problem-solving that considers both technological advancement and environmental responsibility. "We're not just creating better technology, we're creating technology that makes the world better," she said.`,
    urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center",
    date: "2024-01-11",
    author: "Tech Correspondent",
    category: "Technology"
  }
];

const OldNewsDetail: React.FC = () => {
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

  // Fetch news data
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const apiNewsData = await cachedNewsApi.getPopularNewsFromTrending(20);
        const apiNews = apiNewsData.find(item => item.id === Number(id));
        
        if (apiNews) {
          setNews(apiNews);
        } else {
          // Fallback to hardcoded data
          const fallbackNews = oldNewsData.find(item => item.id === Number(id));
          if (fallbackNews) {
            // Convert fallback data to API format
            const convertedNews: TrendingNewsResponse = {
              id: fallbackNews.id,
              title: fallbackNews.title,
              description: fallbackNews.description,
              content: fallbackNews.content,
              image_url: fallbackNews.urlToImage,
              published_at: fallbackNews.date,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              category: fallbackNews.category.toLowerCase(),
              author: fallbackNews.author,
              source: fallbackNews.author,
              read_more_url: `https://example.com/news/${fallbackNews.id}`,
              is_breaking: false,
              is_trending: true,
              trending_score: 70,
              trending_rank: fallbackNews.id,
              is_live: false,
              last_updated: new Date().toISOString(),
            };
            setNews(convertedNews);
          } else {
            setError('News not found');
          }
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Failed to load news detail');
        
        // Fallback to hardcoded data
        const fallbackNews = oldNewsData.find(item => item.id === Number(id));
        if (fallbackNews) {
          const convertedNews: TrendingNewsResponse = {
            id: fallbackNews.id,
            title: fallbackNews.title,
            description: fallbackNews.description,
            content: fallbackNews.content,
            image_url: fallbackNews.urlToImage,
            published_at: fallbackNews.date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: fallbackNews.category.toLowerCase(),
            author: fallbackNews.author,
            source: fallbackNews.author,
            read_more_url: `https://example.com/news/${fallbackNews.id}`,
            is_breaking: false,
            is_trending: true,
            trending_score: 70,
            trending_rank: fallbackNews.id,
            is_live: false,
            last_updated: new Date().toISOString(),
          };
          setNews(convertedNews);
        } else {
          setError('News not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
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
            <TrendingNews limit={8} compact={true} showViewMore={false} title="Trending News" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldNewsDetail;
