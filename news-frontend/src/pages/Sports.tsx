import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestSportsCarousel from "../components/LatestSportsCarousel";

const Sports: React.FC = () => {
  console.log('⚽ SPORTS PAGE RENDERING - Will show ONLY sports news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Sports News Carousel - Top Section */}
        <LatestSportsCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay
              category="sports"
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

export default Sports;
