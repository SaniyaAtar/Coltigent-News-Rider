import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cachedNewsApi } from '../services/newsApi';
import type { TrendingNewsResponse } from '../types/api';
import TrendingNews from './TrendingNews';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  image: string;
  views: number;
  likes: number;
}

const NewsDetail: React.FC = () => {
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
        const apiNewsData = await cachedNewsApi.getRemainingBreakingNewsForLatest(3, 20);
        const apiNews = apiNewsData.find(item => item.id === Number(id));
        
        if (apiNews) {
          setNews(apiNews);
        } else {
          // Fallback to hardcoded data
          const fallbackNews = mockNews.find(item => item.id === id);
          if (fallbackNews) {
            // Convert fallback data to API format
            const convertedNews: TrendingNewsResponse = {
              id: Number(fallbackNews.id),
              title: fallbackNews.title,
              description: fallbackNews.description,
              content: fallbackNews.content,
              image_url: fallbackNews.image,
              published_at: fallbackNews.publishedAt,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              category: fallbackNews.category.toLowerCase(),
              author: fallbackNews.author,
              source: fallbackNews.author,
              read_more_url: `https://example.com/news/${fallbackNews.id}`,
              is_breaking: false,
              is_trending: true,
              trending_score: 70,
              trending_rank: Number(fallbackNews.id),
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
        const fallbackNews = mockNews.find(item => item.id === id);
        if (fallbackNews) {
          const convertedNews: TrendingNewsResponse = {
            id: Number(fallbackNews.id),
            title: fallbackNews.title,
            description: fallbackNews.description,
            content: fallbackNews.content,
            image_url: fallbackNews.image,
            published_at: fallbackNews.publishedAt,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: fallbackNews.category.toLowerCase(),
            author: fallbackNews.author,
            source: fallbackNews.author,
            read_more_url: `https://example.com/news/${fallbackNews.id}`,
            is_breaking: false,
            is_trending: true,
            trending_score: 70,
            trending_rank: Number(fallbackNews.id),
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

  // Mock news data - fallback data
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Revolutionary AI Technology Transforms Healthcare Industry',
      description: 'New artificial intelligence breakthrough promises to revolutionize medical diagnosis and treatment.',
      content: `In a groundbreaking development that could reshape the future of healthcare, researchers have unveiled a revolutionary artificial intelligence system that promises to transform medical diagnosis and treatment protocols.

The new AI technology, developed by a team of leading medical researchers and computer scientists, has demonstrated unprecedented accuracy in diagnosing complex medical conditions. Early clinical trials have shown the system can identify diseases with 95% accuracy, significantly outperforming traditional diagnostic methods.

"This represents a paradigm shift in how we approach medical diagnosis," said Dr. Sarah Johnson, lead researcher on the project. "The AI system can process vast amounts of medical data in seconds, identifying patterns that might take human doctors hours or even days to recognize."

The technology works by analyzing patient data including medical history, symptoms, lab results, and imaging scans. It then cross-references this information with a comprehensive database of medical knowledge to provide accurate diagnoses and treatment recommendations.

Key features of the new system include:
- Real-time analysis of patient data
- Integration with existing medical records systems
- Continuous learning from new cases
- Support for multiple medical specialties

The healthcare industry has been quick to embrace this innovation. Major hospitals and medical centers are already implementing pilot programs to test the system in real-world scenarios. Early results have been promising, with significant improvements in diagnostic accuracy and patient outcomes.

However, the implementation of AI in healthcare also raises important questions about patient privacy, medical liability, and the role of human doctors in the diagnostic process. Experts emphasize that the technology is designed to augment, not replace, human medical expertise.

"The goal is to enhance the capabilities of healthcare professionals, not to eliminate the human element from medicine," explained Dr. Michael Chen, a medical ethics expert. "AI should serve as a powerful tool that helps doctors make better, faster decisions."

The technology is expected to be widely available within the next two years, pending final regulatory approvals. The development team is working closely with medical professionals and regulatory bodies to ensure the system meets the highest standards of safety and effectiveness.

This breakthrough represents just the beginning of AI's potential impact on healthcare. Researchers are already exploring applications in drug discovery, personalized medicine, and preventive care. The future of healthcare looks increasingly intelligent, efficient, and patient-centered.`,
      author: 'Dr. Sarah Johnson',
      publishedAt: '2024-01-15T10:30:00Z',
      category: 'Technology',
      image: 'https://via.placeholder.com/800x400?text=AI+Healthcare+Technology',
      views: 12500,
      likes: 456
    },
    {
      id: '2',
      title: 'Global Markets Show Strong Recovery After Economic Uncertainty',
      description: 'Stock markets worldwide demonstrate resilience with significant gains across major indices.',
      content: `Global financial markets have staged a remarkable recovery following months of economic uncertainty, with major stock indices posting their strongest gains in over a year. The turnaround has been driven by a combination of positive economic indicators, corporate earnings surprises, and renewed investor confidence.

The Dow Jones Industrial Average closed up 2.8% today, while the S&P 500 gained 3.2% and the NASDAQ surged 4.1%. European markets also showed strong performance, with the FTSE 100 up 2.5% and the DAX gaining 3.0%.

"This recovery reflects the underlying strength of the global economy," said Maria Rodriguez, Chief Economist at Global Financial Services. "We're seeing positive signals across multiple sectors, from technology to manufacturing to consumer goods."

Several factors have contributed to the market rally:

1. **Strong Corporate Earnings**: Companies across various sectors have reported better-than-expected quarterly results, indicating robust business fundamentals.

2. **Inflation Control**: Recent data shows inflation rates stabilizing, easing concerns about aggressive monetary policy tightening.

3. **Employment Growth**: Job creation continues at a healthy pace, supporting consumer spending and economic growth.

4. **Technological Innovation**: Breakthroughs in AI, renewable energy, and biotechnology are driving investor optimism about future growth prospects.

The recovery has been particularly strong in the technology sector, with major tech companies leading the market gains. Investors are showing renewed confidence in the sector's long-term growth potential despite recent volatility.

"Technology remains a key driver of economic growth," noted David Kim, Portfolio Manager at TechVentures Capital. "The recent pullback created attractive entry points for long-term investors."

However, analysts caution that markets remain sensitive to geopolitical developments and central bank policy decisions. The Federal Reserve's upcoming meetings will be closely watched for any signals about future interest rate changes.

Looking ahead, market participants are optimistic about continued growth, though they expect some volatility as the economy adjusts to new realities. The focus remains on sustainable, long-term value creation rather than short-term speculation.

This market recovery represents more than just a temporary bounce. It reflects growing confidence in the resilience of the global economy and the ability of businesses to adapt and thrive in changing conditions.`,
      author: 'Maria Rodriguez',
      publishedAt: '2024-01-14T14:20:00Z',
      category: 'Business',
      image: 'https://via.placeholder.com/800x400?text=Global+Markets+Recovery',
      views: 8900,
      likes: 234
    }
  ];

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
            <TrendingNews limit={8} compact={true} showViewMore={false} title="News" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;