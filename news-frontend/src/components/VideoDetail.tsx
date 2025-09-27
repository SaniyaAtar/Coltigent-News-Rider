import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoNewsItem | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all videos to get the specific video and related videos
        const response = await axios.get<VideoNewsResponse>('http://localhost:8000/api/v1/videos/news');
        const allVideos = response.data.video_news || [];
        
        // Find the specific video by ID
        const videoId = parseInt(id || "0", 10);
        const selectedVideo = allVideos.find(v => v.id === videoId);
        
        if (selectedVideo) {
          setVideo(selectedVideo);
          // Set related videos (exclude current video)
          setRelatedVideos(allVideos.filter(v => v.id !== videoId).slice(0, 5));
        } else {
          setError('Video not found');
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video data');
        
        // Fallback data
        const fallbackVideo: VideoNewsItem = {
          id: parseInt(id || "1", 10),
          title: "Breaking News Video",
          description: "Detailed description about the selected video goes here. This section can include news context, publication time, or additional details.",
          thumbnail_url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=300&fit=crop&crop=center",
          video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          category: "Politics",
          published_at: "2025-01-27T10:00:00Z"
        };
        
        setVideo(fallbackVideo);
        setRelatedVideos([
          {
            id: 2,
            title: "Tech News Video",
            description: "Technology news and updates",
            thumbnail_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center",
            video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            category: "Technology",
            published_at: "2025-01-27T09:30:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading video...</h5>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !video) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-warning"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container my-4">
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">Video Not Found</h4>
          <p>The requested video could not be found.</p>
          <hr />
          <button 
            className="btn btn-outline-info"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Error Alert (if showing fallback data) */}
      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}. Showing cached data.
        </div>
      )}

      <div className="row g-3">
        {/* Left Side - Main Video */}
        <div className="col-md-8">
          <div className="mb-3">
            <video
              controls
              className="w-100"
              style={{
                height: "450px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              src={video.video_url}
              poster={video.thumbnail_url}
            />
          </div>
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary me-2">{video.category}</span>
            <small className="text-muted">
              Published: {new Date(video.published_at).toLocaleDateString()}
            </small>
          </div>
          <h3 className="fw-bold">{video.title}</h3>
          <p className="text-muted">{video.description}</p>
        </div>

        {/* Right Side - Related Videos */}
        <div className="col-md-4">
          <h5 className="fw-semibold mb-3">Related Videos</h5>
          <div className="d-flex flex-column gap-3">
            {relatedVideos.map((relatedVideo) => (
              <div
                key={relatedVideo.id}
                className="d-flex align-items-start gap-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/video/${relatedVideo.id}`)}
              >
                <img
                  src={relatedVideo.thumbnail_url}
                  alt={relatedVideo.title}
                  className="rounded"
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/120x80?text=No+Image";
                  }}
                />
                <div>
                  <h6 className="fw-semibold mb-1">{relatedVideo.title}</h6>
                  <small className="text-muted">{relatedVideo.category}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
