import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestLocalCarousel from "../components/LatestLocalCarousel";

const Local: React.FC = () => {
  console.log('📍 LOCAL PAGE RENDERING - Will show ONLY local news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Local News Carousel - Top Section */}
        <LatestLocalCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay
              category="local"
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

export default Local;
