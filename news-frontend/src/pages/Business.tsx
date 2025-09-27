import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestBusinessCarousel from "../components/LatestBusinessCarousel";

const Business: React.FC = () => {
  console.log('💼 BUSINESS PAGE RENDERING - Will show ONLY business news');

  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Business News Carousel - Top Section */}
        <LatestBusinessCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay
              category="business"
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

export default Business;