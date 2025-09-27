import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import lalKillaImage from "../assets/lalKilla.jpg";

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Main Header */}
      <section className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="main-title">About Us</h1>
              <p className="main-subtitle">Learn about Coltigent News Rider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="hero-title">India's leading digital news platform</h2>
              <p className="hero-description">
                Coltigent News Rider delivers impartial, independent, and world-class content 
                that informs, educates, and entertains millions across India and around the world.
              </p>
              <p className="hero-description">
                We are committed to the core values of truth, transparency, fairness, and accountability. 
                Our mission is to foster informed conversations, civic awareness, and democratic values 
                through accurate and independent journalism.
              </p>
              
              <div className="about-details-inline">
                <div className="about-item">
                  <strong>24/7 News Coverage:</strong> Comprehensive news coverage across politics, business, technology, sports, and culture with real-time updates.
                </div>
                
                <div className="about-item">
                  <strong>AI-Powered Content:</strong> Advanced AI technology transforms headlines into detailed articles with original visuals, ensuring copyright-safe content.
                </div>
                
                <div className="about-item">
                  <strong>Technology Innovation:</strong> Continuous innovation in digital journalism using modern tools to deliver accurate, timely, and engaging news content that serves the public interest.
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="hero-image">
                <img 
                  src={lalKillaImage} 
                  alt="Lal Qila - Red Fort Delhi" 
                  className="img-fluid"
                  onError={(e) => {
                    console.log("Image failed to load, showing fallback");
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div style="
                          display: flex; 
                          align-items: center; 
                          justify-content: center; 
                          height: 400px; 
                          background: #f8f8f8;
                          color: #666666;
                          text-align: center;
                          padding: 20px;
                          border-radius: 8px;
                          border: 1px solid #e5e5e5;
                        ">
                          <div>
                            <i class="bi bi-newspaper" style="font-size: 3rem; margin-bottom: 1rem; color: #666666;"></i>
                            <h4>Coltigent News Rider</h4>
                            <p>About Us</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="vision-section">
        <div className="container">
          <h2 className="section-title">Our Vision</h2>
          <div className="row">
            <div className="col-lg-8">
              <div className="vision-content">
                <h3>Building a trusted digital news platform</h3>
                <p>
                  We envision a future where news is more inclusive, accessible, and engaging for all. 
                  Our platform bridges people and information, making quality journalism available 
                  to diverse audiences across India and globally.
                </p>
                <p>
                  We avoid sensationalism and strive to present stories with balance and clarity, 
                  always keeping the public interest at the forefront of our reporting.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="vision-contact">
                <h3>Get in Touch</h3>
                <p>
                  <strong>Email:</strong> <a href="mailto:info@coltigent.com" className="email-link">info@coltigent.com</a>
                </p>
                <p>
                  <strong>Address:</strong><br />
                  Office#818, 8th Floor, Bramha SKY Uzuri, Pimpri, Pune, Maharashtra - 411018
                </p>
                <p>
                  <strong>Business Hours:</strong><br />
                  Mon–Fri: 9 AM – 6 PM | Sat: 10 AM – 4 PM | Sun: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Styles */}
      <style>{`
        .about-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.5;
          color: #2c3e50;
          background: #ffffff;
          overflow-x: hidden;
        }
        
        /* Main Header */
        .main-header {
          padding: 3rem 0 2rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .main-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .main-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 0;
        }
        
        /* Hero Section */
        .hero-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .hero-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }
        
        .hero-description {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          margin-right: 2rem;
          line-height: 1.6;
          text-align: justify;
        }
        
        .about-details-inline {
          margin-top: 2rem;
          margin-right: 2rem;
        }
        
        .about-item {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          text-align: justify;
        }
        
        .about-item strong {
          font-weight: 700;
          color: #1a365d;
        }
        
        .hero-image {
          text-align: center;
        }
        
        .hero-image img {
          width: 100%;
          height: auto;
          max-width: 500px;
          min-height: 400px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 2rem;
          line-height: 1.3;
        }
        
        .email-link {
          color: #a71e34;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .email-link:hover {
          color: #800000;
          text-decoration: none;
        }
        
        /* Vision Section */
        .vision-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .vision-content {
          margin-bottom: 2rem;
        }
        
        .vision-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .vision-content p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .vision-content p:last-child {
          margin-bottom: 0;
        }
        
        .vision-contact {
          background: #f8f8f8;
          padding: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .vision-contact h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .vision-contact p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .vision-contact p:last-child {
          margin-bottom: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-image {
            margin-top: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .main-title {
            font-size: 2rem;
          }
          
          .hero-title {
            font-size: 1.7rem;
          }
          
          .section-title {
            font-size: 1.7rem;
          }
        }
        
        @media (max-width: 480px) {
          .main-title {
            font-size: 1.7rem;
          }
          
          .hero-title {
            font-size: 1.5rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;