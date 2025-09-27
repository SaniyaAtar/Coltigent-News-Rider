import React from "react";
import PublicNews from "../components/PublicNews";
import LatestPublicCarousel from "../components/LatestPublicCarousel";

const Public: React.FC = () => {
  console.log('📢 PUBLIC PAGE RENDERING - Will show ONLY public upload news');
  
  return (
    <main className="page-content">
      <div className="container-fluid">
        {/* Latest Public Upload News Carousel - Top Section */}
        <LatestPublicCarousel limit={10} />
        
        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <div className="container page-container my-3">
              <section className="section-block">
                <h4 className="section-title section-title--accent mb-2">All Public Upload News</h4>
                <div className="separator mb-2" />
                <PublicNews />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Public;
