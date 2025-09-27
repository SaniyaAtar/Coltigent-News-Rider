import React, { useState } from 'react';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: {
    id: number;
    title: string;
    description: string;
    image: string;
    duration: string;
    badge: string;
    badgeColor: string;
    category: string;
    categoryColor: string;
    timeAgo: string;
  } | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose, videoData }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !videoData) return null;

  // Mock video URL - in real app, this would come from your video service
  const videoUrl = `https://sample-videos.com/zip/10/mp4/SampleVideo_${videoData.id}.mp4`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="video-player-title mb-0">{videoData.title}</h5>
              <div className="video-player-meta">
                <span className={`badge ${videoData.badgeColor} me-2`}>{videoData.badge}</span>
                <span className={`badge ${videoData.categoryColor} me-2`}>{videoData.category}</span>
                <span className="text-muted">{videoData.timeAgo}</span>
              </div>
            </div>
            <button className="btn-close" onClick={onClose} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div className="video-player-content">
          <div className="video-container">
            {isPlaying ? (
              <video
                controls
                autoPlay
                className="video-element"
                onPlay={handlePlay}
                onPause={handlePause}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="video-thumbnail-container" onClick={handlePlay}>
                <img src={videoData.image} alt={videoData.title} className="video-thumbnail" />
                <div className="video-play-overlay">
                  <div className="play-button-large">
                    <i className="bi bi-play-circle-fill"></i>
                  </div>
                  <div className="video-duration-large">{videoData.duration}</div>
                </div>
              </div>
            )}
          </div>

          <div className="video-player-description">
            <p>{videoData.description}</p>
          </div>
        </div>

        <div className="video-player-footer">
          <div className="d-flex justify-content-between align-items-center">
            <div className="video-actions">
              <button className="btn btn-outline-primary btn-sm me-2">
                <i className="bi bi-heart"></i> Like
              </button>
              <button className="btn btn-outline-secondary btn-sm me-2">
                <i className="bi bi-share"></i> Share
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-bookmark"></i> Save
              </button>
            </div>
            <div className="video-views">
              <small className="text-muted">
                <i className="bi bi-eye"></i> 1,234 views
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
