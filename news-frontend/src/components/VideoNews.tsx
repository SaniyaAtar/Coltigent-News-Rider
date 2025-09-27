import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAds from "./GoogleAds";
import axios from "axios";

interface VideoNewsItem {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  category: string;
  published_at: string;
}

interface VideoNewsResponse {
  video_news: VideoNewsItem[];
  total: number;
}

const VideoNews: React.FC = () => {
  const [visibleVideos, setVisibleVideos] = useState(3); // Initially show 3 videos in second row
  const [allVideos, setAllVideos] = useState<VideoNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<VideoNewsResponse>('http://localhost:8000/api/v1/videos/news');
        
        // Extract video_news from the response
        const videoNewsData = response.data.video_news || [];
        
        setAllVideos(videoNewsData);
      } catch (err) {
        console.error('Error fetching video news:', err);
        setError('Failed to load video news');
        
        // Fallback to hardcoded data if API fails
        const fallbackData: VideoNewsItem[] = [
          {
            id: 1,
            title: "Championship Highlights",
            description: "Best moments from the championship match featuring incredible plays and dramatic finishes.",
            thumbnail_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            category: "Sports",
            published_at: "2025-01-27T08:45:00Z"
          },
          {
            id: 2,
            title: "Health Update",
            description: "Latest health news and medical breakthroughs that are revolutionizing healthcare.",
            thumbnail_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            category: "Health",
            published_at: "2025-01-27T07:20:00Z"
          },
          {
            id: 3,
            title: "Market Analysis",
            description: "Expert analysis of current market trends, economic indicators, and investment opportunities.",
            thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            category: "Business",
            published_at: "2025-01-27T06:15:00Z"
          },
          {
            id: 4,
            title: "Celebrity Interview",
            description: "Exclusive interview with famous celebrity discussing their latest projects and personal insights.",
            thumbnail_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            category: "Entertainment",
            published_at: "2025-01-27T04:45:00Z"
          },
          {
            id: 5,
            title: "Environmental Report",
            description: "Latest updates on environmental conservation efforts and climate change initiatives.",
            thumbnail_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            category: "Environment",
            published_at: "2025-01-27T03:20:00Z"
          },
          {
            id: 6,
            title: "Education Innovation",
            description: "New developments in education and learning technologies transforming digital learning.",
            thumbnail_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            category: "Education",
            published_at: "2025-01-27T02:10:00Z"
          }
        ];
        setAllVideos(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoNews();
  }, []);

  // Handle toggle button click
  const handleToggleView = () => {
    if (visibleVideos < allVideos.length) {
      // Show more (add 3 videos)
      setVisibleVideos(prev => Math.min(prev + 3, allVideos.length));
    } else {
      // Show less (back to initial amount)
      setVisibleVideos(3);
    }
  };

  // Check if we can show more
  const hasMoreVideos = visibleVideos < allVideos.length;
  
  // Check if we can show less (more than initial amount)
  const canShowLess = visibleVideos > 3;
  
  // Determine button text and icon
  const buttonText = hasMoreVideos ? "View More" : "View Less";
  const buttonIcon = hasMoreVideos ? "bi-arrow-down-circle" : "bi-arrow-up-circle";
  const buttonClass = hasMoreVideos ? "btn-outline-primary" : "btn-outline-secondary";

  // Get visible videos for display
  const visibleVideosData = allVideos.slice(0, visibleVideos);

  // Loading state
  if (loading) {
    return (
      <div className="video-news-section">
        <div className="container-fluid">
          <div className="section-header mb-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="section-icon video-icon me-2">
                  <i className="bi bi-play-circle"></i>
                </div>
                <div>
                  <h4 className="section-title mb-0">Video News</h4>
                  <small className="section-subtitle">Watch the latest news videos</small>
                </div>
              </div>
              <div className="live-indicator">
                <span className="badge bg-danger">LIVE</span>
              </div>
            </div>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Loading video news...</h5>
          </div>
        </div>
      </div>
    );
  }

  // Error state (with fallback data)
  if (error && allVideos.length === 0) {
    return (
      <div className="video-news-section">
        <div className="container-fluid">
          <div className="section-header mb-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="section-icon video-icon me-2">
                  <i className="bi bi-play-circle"></i>
                </div>
                <div>
                  <h4 className="section-title mb-0">Video News</h4>
                  <small className="section-subtitle">Watch the latest news videos</small>
                </div>
              </div>
              <div className="live-indicator">
                <span className="badge bg-danger">LIVE</span>
              </div>
            </div>
          </div>
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-warning"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-news-section">
      <div className="container-fluid">
        <div className="section-header mb-1">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
              <div className="section-icon video-icon me-2">
              <i className="bi bi-play-circle"></i>
            </div>
            <div>
              <h4 className="section-title mb-0">Video News</h4>
              <small className="section-subtitle">Watch the latest news videos</small>
            </div>
          </div>
          <div className="live-indicator">
            <span className="badge bg-danger">LIVE</span>
          </div>
        </div>
      </div>

      {/* Error Alert (if showing fallback data) */}
      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}. Showing cached data.
        </div>
      )}

      {/* Video Grid */}
      <div className="video-grid-container">
          {/* Row 1 - Large Video + Small Video + Google Ads */}
          <div className="row g-3 mb-3 align-items-stretch">
            <div className="col-lg-6 col-md-8 d-flex">
              <div 
                className="video-news-card large w-100"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/video/${allVideos[0]?.id || 1}`)}
              >
              <div className="video-container">
                <div className="video-thumbnail">
                    <img 
                      src={allVideos[0]?.thumbnail_url || "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=300&fit=crop&crop=center"} 
                      alt={allVideos[0]?.title || "Breaking News Video"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/600x300?text=No+Image";
                      }}
                    />
                  <div className="video-overlay">
                    <div className="play-button">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <div className="video-duration">5:32</div>
                    <div className="video-badge">
                      <span className="badge bg-danger">BREAKING</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="video-content">
                <div className="video-meta">
                    <span className="text-muted" style={{ fontSize: "1rem" }}>2 hours ago</span>
                  <span className="badge bg-primary ms-2">{allVideos[0]?.category || "Politics"}</span>
                </div>
                <h5 className="video-title">{allVideos[0]?.title || "Major Political Development Shakes the Nation"}</h5>
                  <p className="video-description">{allVideos[0]?.description || "Breaking news coverage of significant political changes affecting the country's future direction and policy decisions. This comprehensive report covers all the latest developments and expert analysis."}</p>
                <div className="video-footer">
                  <small className="text-muted">By News Reporter</small>
                  <div className="video-stats">
                    <span className="text-muted small">👁️ 15.2k</span>
                    <span className="text-muted small ms-2">❤️ 234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="col-lg-3 col-md-4 d-flex">
              <div 
                className="video-news-card small w-100"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/video/${allVideos[1]?.id || 2}`)}
              >
              <div className="video-container">
                <div className="video-thumbnail">
                    <img 
                      src={allVideos[1]?.thumbnail_url || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center"} 
                      alt={allVideos[1]?.title || "Tech News Video"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  <div className="video-overlay">
                    <div className="play-button">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <div className="video-duration">8:15</div>
                    <div className="video-badge">
                      <span className="badge bg-success">TECH</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="video-content">
                <div className="video-meta">
                    <span className="text-muted" style={{ fontSize: "0.9rem" }}>4 hours ago</span>
                  <span className="badge bg-success ms-2">{allVideos[1]?.category || "Technology"}</span>
                </div>
                  <h6 className="video-title">{allVideos[1]?.title || "Revolutionary AI Technology Demo"}</h6>
                <p className="video-description">{allVideos[1]?.description || "Exclusive demonstration of cutting-edge artificial intelligence technology that could change everything."}</p>
                <div className="video-footer">
                  <small className="text-muted">By Tech Reporter</small>
                  <div className="video-stats">
                    <span className="text-muted small">👁️ 22.8k</span>
                    <span className="text-muted small ms-2">❤️ 456</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="col-lg-3 col-md-12 d-flex">
              <GoogleAds size="medium" title="Sponsored Content" />
             </div>
           </div>

            {/* Row 2 - Dynamic Videos Grid */}
            <div className="row g-3">
              {visibleVideosData.map((video) => (
                <div key={video.id} className="col-lg-4">
             <div 
               className="video-news-card small"
               style={{ cursor: 'pointer' }}
               onClick={() => navigate(`/video/${video.id}`)}
             >
               <div className="video-container">
                 <div className="video-thumbnail">
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x200?text=No+Image";
                          }}
                        />
                   <div className="video-overlay">
                     <div className="play-button">
                       <i className="bi bi-play-circle-fill"></i>
                     </div>
                          <div className="video-duration">3:45</div>
                     <div className="video-badge">
                            <span className="badge bg-primary">{video.category}</span>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="video-content">
                 <div className="video-meta">
                        <span className="text-muted" style={{ fontSize: "1rem" }}>6 hours ago</span>
                        <span className="badge bg-primary ms-2">{video.category}</span>
                 </div>
                      <h6 className="video-title">{video.title}</h6>
                      <p className="video-description">{video.description}</p>
                 <div className="video-footer">
                        <small className="text-muted">By News Reporter</small>
                   <div className="video-stats">
                          <span className="text-muted small">👁️ 8.5k</span>
                          <span className="text-muted small ms-2">❤️ 123</span>
            </div>
          </div>
        </div>
                  </div>
                </div>
              ))}
          </div>

            {/* Toggle View Button */}
            {(hasMoreVideos || canShowLess) && (
              <div className="row mt-4">
                <div className="col-12 d-flex justify-content-center">
                  <button 
                    className={`btn ${buttonClass} toggle-view-btn`}
                    onClick={handleToggleView}
                  >
                    <i className={`bi ${buttonIcon} me-2`}></i>
                    {buttonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default VideoNews;