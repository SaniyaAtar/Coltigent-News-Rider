import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import privacypolicyImage from "../assets/privacypolicy.jpg";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-page">
      {/* Main Header */}
      <section className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="main-title">Privacy Policy</h1>
              <p className="main-subtitle">Your privacy is our priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="hero-title">Protecting your personal information</h2>
              <p className="hero-description">
                Coltigent Technology Services Pvt Ltd ("we," "our," or "us") operates the Coltigent News Rider platform. 
                This Privacy Policy explains how we collect, use, and protect your personal information 
                when you use our news services.
              </p>
              <p className="hero-description">
                We are committed to the highest standards of data protection and privacy. Your trust is important to us, 
                and we handle your information with the utmost care and transparency.
              </p>
              
              <div className="privacy-details-inline">
                <div className="privacy-item">
                  <strong>Secure Data Handling:</strong> We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.
                </div>
                
                <div className="privacy-item">
                  <strong>Transparent Practices:</strong> We clearly explain what information we collect, how we use it, and with whom we share it, ensuring you have full visibility into our practices.
                </div>
                
                <div className="privacy-item">
                  <strong>Your Rights:</strong> You have the right to access, correct, or delete your personal information, and to opt-out of certain data processing activities.
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="hero-image">
                <img 
                  src={privacypolicyImage} 
                  alt="Privacy Policy - Data Protection and Security" 
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
                            <i class="bi bi-shield-lock" style="font-size: 3rem; margin-bottom: 1rem; color: #666666;"></i>
                            <h4>Privacy Policy</h4>
                            <p>Data Protection</p>
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

      {/* Information Collection Section */}
      <section className="info-section">
        <div className="container">
          <h2 className="section-title">Information We Collect</h2>
          <div className="row">
            <div className="col-lg-8">
              <div className="info-content">
                <h3>Personal Information</h3>
                <p>
                  We collect personal information that you voluntarily provide to us, such as your name and email address 
                  when you contact us, apply for career opportunities, or subscribe to our newsletter. This information 
                  helps us respond to your inquiries and provide you with relevant updates.
                </p>
                
                <h3>Technical Information</h3>
                <p>
                  We automatically collect certain technical information when you visit our website, including your IP address, 
                  browser type, device information, pages visited, and time spent on our site. This information helps us 
                  improve our website functionality and user experience.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-contact">
                <h3>How We Use Your Information</h3>
                <p>
                  <strong>Content Delivery:</strong> Provide relevant news and updates tailored to your interests and preferences.
                </p>
                <p>
                  <strong>Service Improvement:</strong> Analyze usage patterns to enhance website functionality and user experience.
                </p>
                <p>
                  <strong>Customer Support:</strong> Respond to inquiries and provide technical assistance when you need help.
                </p>
                <p>
                  <strong>Legal Compliance:</strong> Comply with applicable laws and regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection Section */}
      <section className="protection-section">
        <div className="container">
          <h2 className="section-title">Data Protection & Your Rights</h2>
          <div className="row">
            <div className="col-lg-8">
              <div className="protection-content">
                <h3>Information Sharing</h3>
                <p>
                  <strong>We do not sell your personal information to third parties.</strong> We may share your information 
                  only with your consent, to comply with legal requirements, to protect rights and safety, or with trusted 
                  service providers who help us operate our platform.
                </p>
                
                <h3>Data Security</h3>
                <p>
                  We implement comprehensive security measures including encryption, access controls, continuous monitoring, 
                  and regular security updates to protect your information from unauthorized access, alteration, or disclosure.
                </p>
                
                <h3>Your Rights</h3>
                <p>
                  You have the right to access your personal data, request corrections to inaccurate information, 
                  request deletion of your data, and object to certain processing activities. You can exercise these 
                  rights by contacting us at the information provided below.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="protection-contact">
                <h3>Policy Updates</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us at 
                  <a href="mailto:info@coltigent.com" className="email-link"> info@coltigent.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Styles */}
      <style>{`
        .privacy-page {
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
        
        .privacy-details-inline {
          margin-top: 2rem;
          margin-right: 2rem;
        }
        
        .privacy-item {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          text-align: justify;
        }
        
        .privacy-item strong {
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
        
        /* Info Section */
        .info-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .info-content {
          margin-bottom: 2rem;
        }
        
        .info-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .info-content p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .info-content p:last-child {
          margin-bottom: 0;
        }
        
        .info-contact {
          background: #f8f8f8;
          padding: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .info-contact h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .info-contact p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .info-contact p:last-child {
          margin-bottom: 0;
        }
        
        /* Protection Section */
        .protection-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .protection-content {
          margin-bottom: 2rem;
        }
        
        .protection-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .protection-content p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .protection-content p:last-child {
          margin-bottom: 0;
        }
        
        .protection-contact {
          background: #f8f8f8;
          padding: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .protection-contact h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .protection-contact p {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .protection-contact p:last-child {
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

export default PrivacyPolicy;