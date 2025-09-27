import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TermsOfService: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const Section: React.FC<{ title: string; children: React.ReactNode; icon?: string }> = ({
    title,
    children,
    icon,
  }) => (
    <div className="terms-section mb-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-4" style={{ color: "#000000" }}>
            {icon && <i className={`bi ${icon} me-3 text-info`}></i>}
            {title}
          </h3>
          <div className="text-muted" style={{ lineHeight: "1.7", fontSize: "1rem" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="terms-page">
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: "#000000", fontSize: "3rem" }}>
            Terms of Service
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: "1.2rem" }}>
            Last Updated: {currentDate}
          </p>
          <p className="text-muted mt-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Please read these terms carefully before using Coltigent News Rider. By accessing our services, 
            you agree to be bound by these terms and conditions.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="intro-section card border-0 shadow-sm">
              <div className="card-body p-5 text-center" style={{ 
                background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                borderRadius: "20px"
              }}>
                <h2 className="fw-bold mb-3" style={{ color: "#000000" }}>
                  <i className="bi bi-file-text me-3 text-info"></i>
                  Welcome to Coltigent News Rider
                </h2>
                <p className="mb-0 text-muted" style={{ fontSize: "1.1rem" }}>
                  Welcome to Coltigent News Rider, operated by Coltigent Technology Services Pvt Ltd ("Company," "we," "our," or "us"). 
                  These Terms of Service ("Terms") govern your use of our website, mobile applications, and related services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <Section title="Acceptance of Terms" icon="bi-check-circle">
              <div className="alert alert-success" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>By using Coltigent News Rider, you agree to these terms and our Privacy Policy.</strong>
              </div>
              <p className="mb-3">
                By accessing or using Coltigent News Rider, you confirm that you have read, understood, and agreed to these Terms 
                and our Privacy Policy. If you use the Service on behalf of an organization, you confirm that you 
                have the authority to bind that organization to these Terms.
              </p>
              <p className="mb-0">
                If you do not agree to these Terms, please discontinue use of the Service immediately.
              </p>
            </Section>

            <Section title="Service Description" icon="bi-newspaper">
              <p className="mb-3">Coltigent News Rider provides comprehensive news and information services including:</p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="service-item d-flex align-items-center p-3">
                    <i className="bi bi-globe text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#000000" }}>Global News</h6>
                      <small className="text-muted">World, National, and Local news coverage</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="service-item d-flex align-items-center p-3">
                    <i className="bi bi-graph-up text-success me-3" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#000000" }}>Trending Topics</h6>
                      <small className="text-muted">Real-time trending news and topics</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="service-item d-flex align-items-center p-3">
                    <i className="bi bi-play-circle text-info me-3" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#000000" }}>Video Content</h6>
                      <small className="text-muted">News videos and multimedia content</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="service-item d-flex align-items-center p-3">
                    <i className="bi bi-chat-dots text-warning me-3" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#000000" }}>Interactive Features</h6>
                      <small className="text-muted">Comments, sharing, and community features</small>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 mb-0">
                We may modify, suspend, or discontinue any part of the Service at any time without prior notice.
              </p>
            </Section>

            <Section title="User Responsibilities and Conduct" icon="bi-person-check">
              <p className="mb-3">As a user of Coltigent News Rider, you agree to:</p>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="fw-bold mb-3" style={{ color: "#000000" }}>Required Actions</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Use the Service in compliance with applicable laws</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Maintain the confidentiality of your account</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Provide accurate information when required</li>
                    <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Respect other users and their rights</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="fw-bold mb-3" style={{ color: "#000000" }}>Prohibited Activities</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i>Transmit harmful, unlawful, or offensive content</li>
                    <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i>Attempt to gain unauthorized access</li>
                    <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i>Interfere with Service operations</li>
                    <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i>Violate intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="Content and Intellectual Property" icon="bi-copyright">
              <div className="row">
                <div className="col-md-8">
                  <p className="mb-3">All content, features, and functionality on Coltigent News Rider are protected by intellectual property laws:</p>
                  <ul>
                    <li><strong>Ownership:</strong> Content is owned by Coltigent Technology Services or its licensors</li>
                    <li><strong>Copyright:</strong> Protected by copyright, trademark, and other intellectual property laws</li>
                    <li><strong>Usage Rights:</strong> You may view content for personal, non-commercial use only</li>
                    <li><strong>Restrictions:</strong> No reproduction, distribution, or modification without authorization</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <i className="bi bi-shield-lock text-info" style={{ fontSize: "4rem" }}></i>
                </div>
              </div>
              <div className="alert alert-warning mt-3" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>User-Generated Content:</strong> You retain ownership of content you submit, but grant us a license to use it.
              </div>
            </Section>

            <Section title="Privacy and Data Protection" icon="bi-shield-check">
              <p className="mb-3">
                Your privacy is important to us. Your use of Coltigent News Rider is also governed by our Privacy Policy, 
                which explains how we collect, use, and protect your personal information.
              </p>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="privacy-item text-center p-3">
                    <i className="bi bi-lock text-success mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>Data Security</h6>
                    <small className="text-muted">We implement industry-standard security measures</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="privacy-item text-center p-3">
                    <i className="bi bi-eye-slash text-info mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>Privacy Rights</h6>
                    <small className="text-muted">You have rights to access, correct, and delete your data</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="privacy-item text-center p-3">
                    <i className="bi bi-shield-exclamation text-warning mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>No Guarantees</h6>
                    <small className="text-muted">No method of transmission is 100% secure</small>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Disclaimers and Limitations of Liability" icon="bi-exclamation-triangle">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Important:</strong> Please read this section carefully as it limits our liability.
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="fw-bold mb-3" style={{ color: "#000000" }}>Service Disclaimers</h5>
                  <ul>
                    <li>Service provided "as is" without warranties</li>
                    <li>No guarantee of uninterrupted operation</li>
                    <li>Content accuracy not guaranteed</li>
                    <li>Third-party content not endorsed</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="fw-bold mb-3" style={{ color: "#000000" }}>Liability Limitations</h5>
                  <ul>
                    <li>No liability for indirect damages</li>
                    <li>No liability for data loss</li>
                    <li>Liability limited to service fees paid</li>
                    <li>Force majeure events excluded</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="Account Termination" icon="bi-person-x">
              <p className="mb-3">Either party may terminate this agreement under the following circumstances:</p>
              <div className="row">
                <div className="col-md-6">
                  <div className="termination-reason p-3">
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>
                      <i className="bi bi-shield-exclamation text-danger me-2"></i>
                      We May Terminate If:
                    </h6>
                    <ul className="mb-0">
                      <li>You violate these Terms</li>
                      <li>Fraudulent or illegal activity</li>
                      <li>Abuse of Service features</li>
                      <li>Non-payment of fees (if applicable)</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="termination-reason p-3">
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>
                      <i className="bi bi-person-dash text-info me-2"></i>
                      You May Terminate By:
                    </h6>
                    <ul className="mb-0">
                      <li>Stopping use of the Service</li>
                      <li>Requesting account deletion</li>
                      <li>Contacting us at info@coltigent.com</li>
                      <li>Following our deletion process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Governing Law and Disputes" icon="bi-scale">
              <div className="row">
                <div className="col-md-8">
                  <p className="mb-3">These Terms are governed by the laws of India and any disputes will be resolved as follows:</p>
                  <ul>
                    <li><strong>Governing Law:</strong> Laws of India</li>
                    <li><strong>Jurisdiction:</strong> Courts of Pune, Maharashtra</li>
                    <li><strong>Dispute Resolution:</strong> Good faith negotiation first</li>
                    <li><strong>Arbitration:</strong> Binding arbitration for unresolved disputes</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <i className="bi bi-building text-info" style={{ fontSize: "4rem" }}></i>
                </div>
              </div>
            </Section>

            <Section title="Changes to Terms" icon="bi-arrow-clockwise">
              <p className="mb-3">
                We may update these Terms from time to time. When we make changes, we will:
              </p>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="change-process text-center p-3">
                    <i className="bi bi-calendar-check text-primary mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>Update Date</h6>
                    <small className="text-muted">Change the "Last Updated" date</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="change-process text-center p-3">
                    <i className="bi bi-bell text-warning mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>Notify Users</h6>
                    <small className="text-muted">Email or website notice for major changes</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="change-process text-center p-3">
                    <i className="bi bi-check-circle text-success mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="fw-bold mb-2" style={{ color: "#000000" }}>Acceptance</h6>
                    <small className="text-muted">Continued use constitutes acceptance</small>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Contact Information" icon="bi-telephone">
              <div className="row">
                <div className="col-md-8">
                  <p className="mb-3">For questions about these Terms of Service or our services, please contact us:</p>
                  <div className="contact-info">
                    <p className="mb-2">
                      <i className="bi bi-envelope me-2 text-info"></i>
                      <strong>Email:</strong> <a href="mailto:info@coltigent.com" className="text-info">info@coltigent.com</a>
                    </p>
                    <p className="mb-2">
                      <i className="bi bi-geo-alt me-2 text-danger"></i>
                      <strong>Address:</strong> Office#818, 8th Floor, Bramha SKY Uzuri, Pimpri, Pune, Maharashtra - 411018
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-clock me-2 text-success"></i>
                      <strong>Business Hours:</strong> Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM
                    </p>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <i className="bi bi-chat-dots text-info" style={{ fontSize: "4rem" }}></i>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .terms-page {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          min-height: 100vh;
        }
        
        .terms-section .card {
          transition: all 0.3s ease;
          border-left: 4px solid #000000;
        }
        
        .terms-section .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .intro-section {
          transition: all 0.3s ease;
        }
        
        .intro-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
        }
        
        .service-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .service-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(5px);
        }
        
        .privacy-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .privacy-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .termination-reason {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .termination-reason:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-3px);
        }
        
        .change-process {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .change-process:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
