import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Career: React.FC = () => {

  return (
    <div className="career-page">
      {/* Main Header */}
      <section className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="main-title">Join Our Team</h1>
              <p className="main-subtitle">Build the future of technology with Coltigent Technology Services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="hero-title">We're looking for passionate individuals to join our innovative team</h2>
              <p className="hero-description">
                At Coltigent Technology Services, we believe in fostering a culture of innovation,
                collaboration, and continuous growth. Join a team that values your ideas and supports your career development.
              </p>
              <p className="hero-description">
                We offer competitive benefits, flexible working arrangements, and opportunities to work
                on cutting-edge projects that make a real impact in the technology industry.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&crop=center"
                  alt="Coltigent Team"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="row">
            <div className="col-lg-3">
              <div className="benefit-card">
                <h3>Collaborative Environment</h3>
                <p>Work with talented professionals in a supportive and innovative atmosphere that encourages teamwork and knowledge sharing.</p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="benefit-card">
                <h3>Career Growth</h3>
                <p>Continuous learning opportunities, mentorship programs, and clear career advancement paths to help you reach your professional goals.</p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="benefit-card">
                <h3>Flexible Work</h3>
                <p>Remote and hybrid work options that allow you to maintain a healthy work-life balance while staying productive and engaged.</p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="benefit-card">
                <h3>Competitive Benefits</h3>
                <p>Comprehensive health, dental, and retirement benefits along with performance bonuses and professional development allowances.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Apply Section */}
      <section className="apply-section">
        <div className="container">
          <h2 className="section-title">Ready to Join Us?</h2>
          <div className="row">
            <div className="col-lg-8">
              <div className="apply-content">
                <h3>Start Your Career Journey</h3>
                <p>
                  Send your resume and cover letter to get started on your career journey with Coltigent Technology Services. 
                  We're always looking for talented individuals who share our passion for innovation and technology.
                </p>
                <p>
                  Whether you're a recent graduate or an experienced professional, we have opportunities that can help you 
                  grow and make a meaningful impact in the technology industry.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="apply-contact">
                <h3>Apply Now</h3>
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
        .career-page {
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
        
        /* Benefits Section */
        .benefits-section {
          padding: 3rem 0;
          background: #f8f8f8;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 2rem;
          line-height: 1.3;
        }
        
        .benefit-card {
          background: #ffffff;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .benefit-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .benefit-card p {
          font-size: 1rem;
          color: #000000;
          line-height: 1.6;
          margin-bottom: 0;
          text-align: justify;
        }
        
        /* Apply Section */
        .apply-section {
          padding: 3rem 0;
          background: #ffffff;
        }
        
        .apply-content {
          margin-bottom: 2rem;
        }
        
        .apply-content h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .apply-content p {
          font-size: 1rem;
          color: #000000;
          line-height: 1.6;
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .apply-content p:last-child {
          margin-bottom: 0;
        }
        
        .apply-contact {
          background: #f8f8f8;
          padding: 2rem;
          border: 1px solid #e5e5e5;
        }
        
        .apply-contact h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .apply-contact p {
          font-size: 1rem;
          color: #000000;
          line-height: 1.6;
          margin-bottom: 0;
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
          
          .benefit-card {
            padding: 1.5rem;
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
          
          .benefit-card {
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Career;
