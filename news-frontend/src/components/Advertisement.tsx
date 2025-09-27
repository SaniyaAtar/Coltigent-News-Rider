import React from 'react';
import GoogleAds from './GoogleAds';

const Advertisement: React.FC = () => {
  return (
    <div className="advertisement-section">
      <div className="container-fluid px-3 py-2">
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "728px", width: "100%" }}>
            <GoogleAds size="medium" title="Advertisement" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
