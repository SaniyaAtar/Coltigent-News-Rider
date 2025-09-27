import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestTrendingCarousel from "../components/LatestTrendingCarousel";

const TrendingAPI: React.FC = () => {
  console.log('🔥 TRENDING PAGE RENDERING - Will show ONLY trending news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Trending News Carousel - Top Section */}
        <LatestTrendingCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay 
              category="trending"
              layout="grid"
              limit={12}
              showHeader={true}
              showFilters={true}
              showViewMore={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrendingAPI;
