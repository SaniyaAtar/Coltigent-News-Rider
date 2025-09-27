import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import coltigentLogo from "../assets/logo.jpg";

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <header className="border-bottom bg-white compact-header">
      {/* Top Bar - Smaller */}
      <div className="container d-flex justify-content-between align-items-center px-3 py-1 bg-white compact-top-bar" style={{ maxWidth: "1200px" }}>
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          {today} <span className="text-danger fw-bold">e-Paper</span>
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-lightning-charge-fill text-warning me-1" style={{ fontSize: '0.8rem' }}></i>
          <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
            <span className="text-danger">Powered By:</span> <span className="text-dark">Coltigent Technology Services Pvt Ltd</span>
          </span>
        </div>
      </div>
<hr />      
      {/* Navbar - Centered and Compact */}
      <nav className="navbar navbar-expand-lg bg-white compact-navbar">
        <div className="container d-flex justify-content-center" style={{ maxWidth: "1200px" }}>
          {/* Centered Navigation */}
          <div className="d-flex align-items-center justify-content-center w-100">
            {/* Logo */}
            <a
              className="navbar-brand me-4"
              href="/"
              style={{ 
                display: "flex", 
                alignItems: "center",
                padding: "0.25rem",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "scale(1.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
            >
              <img 
                src={coltigentLogo} 
                alt="COLTIGENT Logo" 
                style={{ 
                  width: "70px", 
                  height: "50px", 
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                  transition: "all 0.3s ease",
                  transform: "scale(1.1)"
                }}
              />
            </a>

            {/* Toggle Button (Mobile) */}
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Nav Links - Centered */}
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/" style={{ fontSize: '1.1rem' }}>Home</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/national" style={{ fontSize: '1.1rem' }}>National</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/world" style={{ fontSize: '1.1rem' }}>World</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/sports" style={{ fontSize: '1.1rem' }}>Sports</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/business" style={{ fontSize: '1.1rem' }}>Business</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/education" style={{ fontSize: '1.1rem' }}>Education</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/local" style={{ fontSize: '1.1rem' }}>Local</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/trending" style={{ fontSize: '1.1rem' }}>Trending</a></li>
                <li className="nav-item"><a className="nav-link fw-bold text-dark px-2" href="/public" style={{ fontSize: '1.1rem' }}>Public</a></li>
              </ul>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;