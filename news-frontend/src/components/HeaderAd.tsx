import React from 'react';
import GoogleAds from './GoogleAds';

const HeaderAd: React.FC = () => {
  return (
    <div className="header-ad-section">
      <div className="container-fluid px-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "120px", maxHeight: "150px" }}>
              <div style={{ width: "100%", maxWidth: "100%" }}>
                <GoogleAds size="medium" title="Advertisement" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAd;
