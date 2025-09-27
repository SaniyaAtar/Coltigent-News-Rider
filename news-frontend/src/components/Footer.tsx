import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-2 mt-5" style={{ 
      background: 'linear-gradient(135deg, #6c757d, #495057)',
      borderTop: '3px solid #800000'
    }}>
      <div className="container-fluid">
        <div className="container">
          <div className="row gy-2">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-2">
                <h4 className="fw-bold text-warning mb-2">
                  <i className="bi bi-newspaper me-2"></i>
                  Coltigent News Rider, Powered By
                </h4>
                <h5 className="fw-bold text-light mb-2">Coltigent Technology Services Pvt Ltd</h5>
                <p className="text-light opacity-75 mb-2">
                  Delivering innovative IT solutions and cutting-edge news technology since 2025. 
                  Your trusted source for the latest news and technology insights.
                </p>
                <div className="d-flex gap-3">
                  <a href="#" className="text-warning fs-4" title="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="text-warning fs-4" title="Twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="text-warning fs-4" title="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-warning fs-4" title="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-warning mb-2">
                <i className="bi bi-compass me-2"></i>
                Navigation
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-house me-2"></i>Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/national" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-globe me-2"></i>National
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/world" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-globe-americas me-2"></i>World
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/sports" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-trophy me-2"></i>Sports
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/business" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-briefcase me-2"></i>Business
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/local" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-geo-alt me-2"></i>Local
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/education" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-book me-2"></i>Education
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/trending" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-fire me-2"></i>Trending
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/videos" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-play-circle me-2"></i>Videos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-warning mb-2">
                <i className="bi bi-link-45deg me-2"></i>
                Quick Links
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/about" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-info-circle me-2"></i>About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-envelope me-2"></i>Contact
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/career" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-person-workspace me-2"></i>Careers
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy-policy" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-shield-check me-2"></i>Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/terms-of-service" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-file-text me-2"></i>Terms of Service
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/help" className="text-light text-decoration-none d-flex align-items-center hover-gold">
                    <i className="bi bi-question-circle me-2"></i>Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-warning mb-2">
                <i className="bi bi-telephone me-2"></i>
                Contact Info
              </h6>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-envelope text-warning me-3"></i>
                  <a href="mailto:info@coltigent.com" className="text-light text-decoration-none hover-gold">
                    info@coltigent.com
                  </a>
                </div>
                <div className="d-flex align-items-start mb-2">
                  <i className="bi bi-geo-alt text-warning me-3 mt-1"></i>
                  <span className="text-light">
                    Office#818, 8th Floor, Bramha SKY Uzuri, A Building<br />
                    Opposite PCMC Corporation Building<br />
                    Pimpri, Pune, MH-411018
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-2" style={{ borderColor: '#800000', opacity: 0.3 }} />
          
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="text-light small">
                © {new Date().getFullYear()} Coltigent Technology Services Pvt Ltd. All rights reserved.
              </div>
            </div>
            <div className="col-md-6 text-md-end">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
