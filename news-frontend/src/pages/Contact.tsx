import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NewsChatbot from "../components/NewsChatbot";

const Contact: React.FC = () => {

  return (
    <div className="contact-page">
      {/* Main Header */}
      <section className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="main-title">Contact Us</h1>
              <p className="main-subtitle">Get in touch with Coltigent Technology Services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="hero-title">We're here to help you with your technology needs</h2>
              <p className="hero-description">
                Connect with Coltigent Technology Services. We're here to help you
                with your technology needs and answer any questions about Coltigent News Rider.
              </p>
              <p className="hero-description">
                Whether you're looking for advertising opportunities, technical support, or general inquiries, 
                our team is ready to assist you with professional and timely responses.
              </p>
              
              <div className="contact-details-inline">
                <div className="contact-item">
                  <strong>Office Address:</strong><br />
                  Office#818, 8th Floor, Bramha SKY Uzuri, Pimpri, Pune, Maharashtra - 411018
                </div>
                
                <div className="contact-item">
                  <strong>Email:</strong> <a href="mailto:info@coltigent.com" className="email-link">info@coltigent.com</a>
                </div>
                
                <div className="contact-item">
                  <strong>Business Hours:</strong><br />
                  Mon–Fri: 9 AM – 6 PM | Sat: 10 AM – 4 PM | Sun: Closed
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="hero-image">
                <img 
                  src="/contact.jpg" 
                  alt="Contact Us" 
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
                            <i class="bi bi-building" style="font-size: 3rem; margin-bottom: 1rem; color: #666666;"></i>
                            <h4>Coltigent Technology Services</h4>
                            <p>Contact Us</p>
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


      {/* Advertise With Us Section */}
      <section className="advertise-section">
        <div className="container">
          <h2 className="section-title">Advertise With Us</h2>
          <div className="row">
            <div className="col-lg-8">
              <div className="advertise-content">
                <h3>Reach thousands of readers and grow your business</h3>
                <p>
                  Partner with Coltigent News Rider to reach a diverse and engaged audience. 
                  Our advertising solutions are designed to help your business grow and connect 
                  with potential customers across India and globally.
                </p>
                <p>
                  Contact our advertising team to discuss customized advertising packages, 
                  sponsored content opportunities, and digital marketing solutions tailored to your needs.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="advertise-contact">
                <h3>Contact Our Advertising Team</h3>
                <p>
                  <a href="mailto:info@coltigent.com" className="email-link">
                    info@coltigent.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBC-Inspired Design */}
      <style>{`
        .contact-page {
          font-family: 'Arial', 'Helvetica', sans-serif;
          line-height: 1.5;
          color: #000000;
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
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .main-subtitle {
          font-size: 1.1rem;
          color: #666666;
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
          color: #000000;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }
        
        .hero-description {
          font-size: 1rem;
          color: #000000;
          margin-bottom: 1.5rem;
          margin-right: 2rem;
          line-height: 1.6;
          text-align: justify;
        }
        
        .contact-details-inline {
          margin-top: 2rem;
          margin-right: 2rem;
        }
        
        .contact-item {
          font-size: 1rem;
          color: #000000;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          text-align: justify;
        }
        
        .contact-item strong {
          font-weight: 700;
          color: #000000;
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
          color: #000000;
          margin-bottom: 2rem;
          line-height: 1.3;
        }
        
        .email-link {
          color: #000000;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .email-link:hover {
          color: #666666;
          text-decoration: none;
        }
        
        /* Advertise Section */
        .advertise-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .advertise-content {
          margin-bottom: 2rem;
        }
        
        .advertise-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .advertise-content p {
          font-size: 1rem;
          color: #000000;
          line-height: 1.6;
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .advertise-content p:last-child {
          margin-bottom: 0;
        }
        
        .advertise-contact {
          background: #f8f8f8;
          padding: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .advertise-contact h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .advertise-contact p {
          font-size: 1rem;
          color: #000000;
          line-height: 1.6;
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

      {/* News Chatbot */}
      <NewsChatbot />
    </div>
  );
};

export default Contact;
