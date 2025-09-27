import React, { useState } from 'react';

interface MediaPlayerProps {
  fileUrl: string;
  fileName?: string;
  className?: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ fileUrl, fileName, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine file type based on URL extension
  const getFileType = (url: string): 'video' | 'audio' | 'unknown' => {
    const extension = url.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
    
    if (videoExtensions.includes(extension || '')) {
      return 'video';
    } else if (audioExtensions.includes(extension || '')) {
      return 'audio';
    }
    return 'unknown';
  };

  const fileType = getFileType(fileUrl);
  const displayName = fileName || fileUrl.split('/').pop() || 'Media File';

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (fileType === 'unknown') {
    return (
      <div className={`media-player-container ${className}`}>
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Unsupported file format. 
          <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm ms-2">
            <i className="bi bi-download me-1"></i>
            Download File
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`media-player-container ${className}`}>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <div className="d-flex align-items-center">
            <i className={`bi ${fileType === 'video' ? 'bi-play-circle' : 'bi-music-note-beamed'} me-2 text-primary`}></i>
            <span className="fw-bold">
              {fileType === 'video' ? 'Video' : 'Audio'}: {displayName}
            </span>
          </div>
        </div>
        <div className="card-body p-0 position-relative">
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mb-0">Loading {fileType}...</p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
                <p className="text-danger mt-2 mb-3">Failed to load {fileType}</p>
                <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                  <i className="bi bi-download me-1"></i>
                  Download File
                </a>
              </div>
            </div>
          )}

          {fileType === 'video' && (
            <video
              controls
              className="w-100"
              style={{ 
                minHeight: isLoading || hasError ? '0' : '300px',
                display: isLoading || hasError ? 'none' : 'block'
              }}
              onLoadStart={handleLoadStart}
              onCanPlay={handleCanPlay}
              onError={handleError}
              preload="metadata"
            >
              <source src={fileUrl} type="video/mp4" />
              <source src={fileUrl} type="video/webm" />
              <source src={fileUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          )}

          {fileType === 'audio' && (
            <div 
              className="p-4"
              style={{ 
                minHeight: isLoading || hasError ? '0' : '120px',
                display: isLoading || hasError ? 'none' : 'block'
              }}
            >
              <audio
                controls
                className="w-100"
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onError={handleError}
                preload="metadata"
              >
                <source src={fileUrl} type="audio/mpeg" />
                <source src={fileUrl} type="audio/wav" />
                <source src={fileUrl} type="audio/ogg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
        </div>
        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-file-earmark me-1"></i>
              {fileType === 'video' ? 'Video' : 'Audio'} File
            </small>
            <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-download me-1"></i>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
