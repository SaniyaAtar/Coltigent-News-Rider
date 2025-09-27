import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import GoogleAds from "./GoogleAds";

const CategoryVideoNews: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [visibleVideos, setVisibleVideos] = useState(7); // Initially show 7 videos (1 big + 6 small)
  const [currentSlide, setCurrentSlide] = useState(0); // For slider functionality

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };
  const videoData = [
    // First row - Single featured video
    {
      id: 1,
      title: "Major Political Development Shakes the Nation",
      description: "Breaking news coverage of significant political changes affecting the country's future direction and policy decisions. This comprehensive report covers all the latest developments and expert analysis.",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop&crop=center",
      duration: "5:32",
      badge: "BREAKING",
      badgeColor: "bg-danger",
      category: "Politics",
      categoryColor: "bg-primary",
      timeAgo: "2 hours ago",
      isLarge: true
    },
    // Second row - Two small videos
    {
      id: 2,
      title: "Revolutionary Tech Innovation",
      description: "Latest technological breakthrough promises to transform multiple industries worldwide.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center",
      duration: "3:45",
      badge: "TECH",
      badgeColor: "bg-success",
      category: "Technology",
      categoryColor: "bg-info",
      timeAgo: "4 hours ago",
      isLarge: false
    },
    {
      id: 3,
      title: "Economic Market Analysis",
      description: "Comprehensive analysis of current market trends and economic indicators affecting global markets.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center",
      duration: "4:12",
      badge: "BUSINESS",
      badgeColor: "bg-warning",
      category: "Business",
      categoryColor: "bg-secondary",
      timeAgo: "6 hours ago",
      isLarge: false
    },
    // Third row - Two small videos
    {
      id: 4,
      title: "Sports Championship Highlights",
      description: "Exciting highlights from the latest championship match with incredible performances.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&crop=center",
      duration: "2:58",
      badge: "SPORTS",
      badgeColor: "bg-primary",
      category: "Sports",
      categoryColor: "bg-success",
      timeAgo: "8 hours ago",
      isLarge: false
    },
    {
      id: 5,
      title: "Health and Wellness Update",
      description: "Important health updates and wellness tips for maintaining a healthy lifestyle.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
      duration: "3:20",
      badge: "HEALTH",
      badgeColor: "bg-info",
      category: "Health",
      categoryColor: "bg-primary",
      timeAgo: "10 hours ago",
      isLarge: false
    },
    // Fourth row - Two small videos
    {
      id: 6,
      title: "Environmental Conservation Efforts",
      description: "Latest initiatives and efforts in environmental conservation and climate change mitigation.",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop&crop=center",
      duration: "4:35",
      badge: "ENVIRONMENT",
      badgeColor: "bg-success",
      category: "Environment",
      categoryColor: "bg-info",
      timeAgo: "12 hours ago",
      isLarge: false
    },
    {
      id: 7,
      title: "Education System Reforms",
      description: "New educational policies and reforms aimed at improving learning outcomes for students.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&crop=center",
      duration: "3:15",
      badge: "EDUCATION",
      badgeColor: "bg-warning",
      category: "Education",
      categoryColor: "bg-primary",
      timeAgo: "14 hours ago",
      isLarge: false
    },
    // Additional videos for "View More" functionality
    {
      id: 8,
      title: "Artificial Intelligence in Healthcare",
      description: "Revolutionary AI technology is transforming medical diagnosis and treatment methods worldwide.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
      duration: "4:20",
      badge: "AI",
      badgeColor: "bg-info",
      category: "Technology",
      categoryColor: "bg-primary",
      timeAgo: "16 hours ago",
      isLarge: false
    },
    {
      id: 9,
      title: "Space Tourism Takes Off",
      description: "Commercial space travel becomes reality as companies launch successful tourist missions.",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop&crop=center",
      duration: "3:45",
      badge: "SPACE",
      badgeColor: "bg-dark",
      category: "Space",
      categoryColor: "bg-secondary",
      timeAgo: "18 hours ago",
      isLarge: false
    },
    {
      id: 10,
      title: "Renewable Energy Revolution",
      description: "Breakthrough in clean energy technology promises to transform global power generation.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=center",
      duration: "5:10",
      badge: "ENERGY",
      badgeColor: "bg-success",
      category: "Environment",
      categoryColor: "bg-info",
      timeAgo: "20 hours ago",
      isLarge: false
    },
    {
      id: 11,
      title: "Digital Currency Adoption",
      description: "Major financial institutions embrace cryptocurrency, signaling mainstream adoption.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center",
      duration: "4:35",
      badge: "CRYPTO",
      badgeColor: "bg-warning",
      category: "Finance",
      categoryColor: "bg-success",
      timeAgo: "22 hours ago",
      isLarge: false
    },
    {
      id: 12,
      title: "Autonomous Vehicles Launch",
      description: "Self-driving cars hit the roads in major cities, marking a transportation milestone.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop&crop=center",
      duration: "3:55",
      badge: "AUTO",
      badgeColor: "bg-primary",
      category: "Transportation",
      categoryColor: "bg-info",
      timeAgo: "1 day ago",
      isLarge: false
    },
    {
      id: 13,
      title: "Virtual Reality in Education",
      description: "VR technology revolutionizes classroom learning with immersive educational experiences.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&crop=center",
      duration: "4:15",
      badge: "VR",
      badgeColor: "bg-info",
      category: "Education",
      categoryColor: "bg-primary",
      timeAgo: "1 day ago",
      isLarge: false
    },
    {
      id: 14,
      title: "Ocean Conservation Success",
      description: "Marine protection initiatives successfully restore ocean ecosystems and protect species.",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop&crop=center",
      duration: "3:30",
      badge: "OCEAN",
      badgeColor: "bg-info",
      category: "Environment",
      categoryColor: "bg-success",
      timeAgo: "1 day ago",
      isLarge: false
    },
    {
      id: 15,
      title: "Smart Cities Transformation",
      description: "IoT technology integration enhances urban services and reduces environmental impact.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop&crop=center",
      duration: "4:45",
      badge: "SMART",
      badgeColor: "bg-primary",
      category: "Technology",
      categoryColor: "bg-info",
      timeAgo: "2 days ago",
      isLarge: false
    }
  ];

  const largeVideo = videoData.find(video => video.isLarge);
  const smallVideos = videoData.filter(video => !video.isLarge);

  // Get visible small videos based on current state
  const visibleSmallVideos = smallVideos.slice(0, visibleVideos - 1); // -1 because we always show the large video in first row

  // Group visible small videos into pairs for rows
  const videoRows = [];
  for (let i = 0; i < visibleSmallVideos.length; i += 2) {
    videoRows.push(visibleSmallVideos.slice(i, i + 2));
  }

  // Handle toggle button click
  const handleToggleView = () => {
    if (visibleVideos < videoData.length) {
      // Show more
      setVisibleVideos(prev => prev + 4);
    } else {
      // Show less (back to initial amount)
      setVisibleVideos(7);
    }
    // Reset slider to show the new content
    setCurrentSlide(0);
  };

  // Handle slider navigation
  const handleNextSlide = () => {
    const maxSlides = Math.ceil((visibleSmallVideos.length - 2) / 2); // -2 because we show 2 videos per slide
    setCurrentSlide(prev => (prev + 1) % maxSlides);
  };

  const handlePrevSlide = () => {
    const maxSlides = Math.ceil((visibleSmallVideos.length - 2) / 2);
    setCurrentSlide(prev => (prev - 1 + maxSlides) % maxSlides);
  };

  // Check if we can show more
  const hasMoreVideos = visibleVideos < videoData.length;
  
  // Check if we can show less (more than initial amount)
  const canShowLess = visibleVideos > 7;
  
  // Determine button text and icon
  const buttonText = hasMoreVideos ? "View More" : "View Less";
  const buttonIcon = hasMoreVideos ? "bi-arrow-down-circle" : "bi-arrow-up-circle";
  const buttonClass = hasMoreVideos ? "btn-outline-primary" : "btn-outline-secondary";

  return (
    <div className="category-video-news-section">
      <div className="container-fluid">
        {/* First Row - Large Video + Google Ads */}
        <div className="row g-3 mb-4 align-items-stretch">
          <div className="col-lg-9 col-md-8 d-flex">
            <div className="category-video-card large w-100" onClick={() => handleVideoClick(largeVideo)}>
              <div className="video-container">
                <div className="video-thumbnail">
                  <img src={largeVideo?.image} alt={largeVideo?.title} />
                  <div className="video-overlay">
                    <div className="play-button">
                      <i className="bi bi-play-circle-fill"></i>
                    </div>
                    <div className="video-duration">{largeVideo?.duration}</div>
                    <div className="video-badge">
                      <span className={`badge ${largeVideo?.badgeColor}`}>{largeVideo?.badge}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="video-content">
                <div className="video-meta">
                  <span className="text-muted" style={{ fontSize: "1rem" }}>{largeVideo?.timeAgo}</span>
                  <span className={`badge ${largeVideo?.categoryColor} ms-2`}>{largeVideo?.category}</span>
                </div>
                <h5 className="video-title">{largeVideo?.title}</h5>
                <p className="video-description">{largeVideo?.description}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 d-flex">
            <GoogleAds size="medium" title="Sponsored Content" />
          </div>
        </div>

        {/* Video Slider for Small Videos */}
        {visibleSmallVideos.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="position-relative">
                {/* Slider Navigation Buttons */}
                {visibleSmallVideos.length > 2 && (
                  <>
                    <button
                      className="btn btn-outline-primary position-absolute top-50 start-0 translate-middle-y z-3"
                      onClick={handlePrevSlide}
                      style={{ 
                        zIndex: 10,
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary position-absolute top-50 end-0 translate-middle-y z-3"
                      onClick={handleNextSlide}
                      style={{ 
                        zIndex: 10,
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </>
                )}

                {/* Video Slider Container */}
                <div 
                  className="d-flex overflow-hidden"
                  style={{ 
                    transition: "transform 0.3s ease-in-out",
                    transform: `translateX(-${currentSlide * 100}%)`
                  }}
                >
                  {videoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="row g-3 flex-shrink-0" style={{ width: "100%" }}>
                      {row.map((video) => (
                        <div key={video.id} className="col-lg-6">
                          <div className="category-video-card small" onClick={() => handleVideoClick(video)}>
                            <div className="video-container">
                              <div className="video-thumbnail">
                                <img src={video.image} alt={video.title} />
                                <div className="video-overlay">
                                  <div className="play-button">
                                    <i className="bi bi-play-circle-fill"></i>
                                  </div>
                                  <div className="video-duration">{video.duration}</div>
                                  <div className="video-badge">
                                    <span className={`badge ${video.badgeColor}`}>{video.badge}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="video-content">
                              <div className="video-meta">
                                <span className="text-muted" style={{ fontSize: "0.9rem" }}>{video.timeAgo}</span>
                                <span className={`badge ${video.categoryColor} ms-2`}>{video.category}</span>
                              </div>
                              <h6 className="video-title">{video.title}</h6>
                              <p className="video-description">{video.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Slider Indicators */}
                {visibleSmallVideos.length > 2 && (
                  <div className="d-flex justify-content-center mt-3">
                    {Array.from({ length: Math.ceil(visibleSmallVideos.length / 2) }).map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm mx-1 ${currentSlide === index ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentSlide(index)}
                        style={{ 
                          width: "12px", 
                          height: "12px", 
                          borderRadius: "50%", 
                          padding: "0",
                          border: "none"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
        videoData={selectedVideo}
      />
    </div>
  );
};

export default CategoryVideoNews;
