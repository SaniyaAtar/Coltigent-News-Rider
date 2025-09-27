import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestWorldCarousel from "../components/LatestWorldCarousel";

const World: React.FC = () => {
  console.log('🌍 WORLD PAGE RENDERING - Will show ONLY world news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest World News Carousel - Top Section */}
        <LatestWorldCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay 
              category="world"
              layout="grid"
              limit={12}
              showHeader={true}
              showFilters={true}
              showViewMore={true}
              apiMethod="excluding_trending"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default World;
