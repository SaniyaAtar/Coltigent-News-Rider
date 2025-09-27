import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestNationalCarousel from "../components/LatestNationalCarousel";

const National: React.FC = () => {
  console.log('🇮🇳 NATIONAL PAGE RENDERING - Will show ONLY national news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest National News Carousel - Top Section */}
        <LatestNationalCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay 
              category="national"
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

export default National;
