import React from "react";
import CategoryDisplay from "../components/CategoryDisplay";
import LatestEducationCarousel from "../components/LatestEducationCarousel";

const Education: React.FC = () => {
  console.log('🎓 EDUCATION PAGE RENDERING - Will show ONLY education news');

  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Education News Carousel - Top Section */}
        <LatestEducationCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <CategoryDisplay
              category="education"
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

export default Education;