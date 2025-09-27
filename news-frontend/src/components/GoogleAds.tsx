import React from "react";

interface GoogleAdsProps {
  size?: "small" | "medium" | "large";
  title?: string;
}

const GoogleAds: React.FC<GoogleAdsProps> = ({ 
  size = "medium", 
  title = "Advertisement" 
}) => {
  const getAdDimensions = () => {
    switch (size) {
      case "small":
        return { width: "100%", height: "250px" };
      case "large":
        return { width: "100%", height: "90px" };
      default: // medium - match video height
        return { width: "100%", height: "100%" };
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div className="google-ads-container d-flex flex-column h-100">
      <div className="ads-header mb-3">
        <h6 className="text-muted text-center mb-0" style={{ fontSize: "0.8rem", fontWeight: "500" }}>
          {title}
        </h6>
      </div>
      <div 
        className="ads-placeholder d-flex align-items-center justify-content-center"
        style={{
          width: "100%",
          height: dimensions.height,
          minHeight: "300px",
          backgroundColor: "#f8f9fa",
          border: "2px dashed #dee2e6",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
          flex: "1"
        }}
      >
        {/* Google Ads Placeholder Content */}
        <div className="text-center">
          <div className="mb-2">
            <i className="bi bi-google text-primary" style={{ fontSize: "2rem" }}></i>
          </div>
          <div className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            Google Ads
          </div>
          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
            {dimensions.width} × {dimensions.height}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div 
          className="position-absolute top-0 start-0"
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(45deg, transparent 49%, rgba(0,123,255,0.1) 50%, transparent 51%)",
            pointerEvents: "none"
          }}
        />
      </div>
      
      {/* Ads Disclaimer */}
      <div className="ads-disclaimer mt-2">
        <small className="text-muted text-center d-block" style={{ fontSize: "0.7rem" }}>
          Advertisement
        </small>
      </div>
    </div>
  );
};

export default GoogleAds;
