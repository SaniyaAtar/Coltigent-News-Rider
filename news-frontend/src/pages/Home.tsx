import React from "react";
import BreakingNews from "../components/BreakingNews";
import TrendingNews from "../components/TrendingNews";
import PublicNews from "../components/PublicNews";
import NewsChatbot from "../components/NewsChatbot";
import NewsFeed from "../components/NewsFeed";
import VideoNews from "../components/VideoNews";
import OldNews from "../components/OldNews";

const Home: React.FC = () => {
  console.log('Home component rendering - starting render');

  return (
    <main className="page-content">
      {/* Main Content */}
      <div className="container-fluid">
        <div className="row equal-height-row g-3">
          {/* Left Column - Trending News */}
          <div className="col-lg-3">
            <div className="news-section-card h-100">
              <div className="section-header trending-header">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="section-icon trending-icon">
                      <i className="bi bi-fire"></i>
                    </div>
                    <div>
                      <small className="section-subtitle">What's hot right now</small>
                    </div>
                  </div>
                  <div className="live-indicator">
                    <span className="badge bg-danger">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="section-content trending-content">
                <TrendingNews limit={10} compact={true} showViewMore={false} />
              </div>
            </div>
          </div>

          {/* Center Column - Breaking News (2x larger) */}
          <div className="col-lg-6">
            <div className="news-section-card h-100">
              <div className="section-header breaking-header">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="section-icon breaking-icon">
                      <i className="bi bi-lightning-charge"></i>
                    </div>
                    <div>
                      <h5 className="section-title mb-0">Breaking News</h5>
                      <small className="section-subtitle">Latest updates</small>
                    </div>
                  </div>
                  <div className="live-indicator">
                    <span className="badge bg-warning text-dark">BREAKING</span>
                  </div>
                </div>
              </div>
              <div className="section-content breaking-content">
                <BreakingNews />
              </div>
            </div>
          </div>

          {/* Right Column - Public News */}
          <div className="col-lg-3">
            <div className="news-section-card h-100">
              <div className="section-header public-header">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="section-icon public-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <div>
                      <h5 className="section-title mb-0">Public NewsBot</h5>
                      <small className="section-subtitle">What's Nation Thoughts</small>
                    </div>
                  </div>
                  <div className="live-indicator">
                    <span className="badge bg-info">CROWD</span>
                  </div>
                </div>
              </div>
              <div className="section-content public-content">
                <PublicNews initialLimit={10} enableControls={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Latest News Section */}
        <div className="row mt-5">
        <div className="col-12">
            <NewsFeed />
          </div>
        </div>

        {/* Video News Section */}
        <div className="row mt-5">
          <div className="col-12">
            <VideoNews />
          </div>
        </div>

        {/* Old News Section */}
        <div className="row mt-5">
          <div className="col-12">
            <OldNews limit={15} showViewMore={true} />
          </div>
        </div>
        
      </div>

      {/* News Chatbot */}
      <NewsChatbot />
    </main>
  );
};

export default Home;
