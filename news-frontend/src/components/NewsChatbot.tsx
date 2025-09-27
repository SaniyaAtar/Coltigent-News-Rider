import React, { useState } from "react";
import { X, Send, Upload, User, Phone, Mail, MapPin, FileText, AlertCircle } from "lucide-react";
import { userChatbotApiService } from "../services/userChatbotApi";

interface FormData {
  full_name: string;
  email_id: string;
  contact_number: string;
  address: string;
  news_desc: string;
  file: File | null;
  article_type: 'text' | 'audio' | 'video';
}

interface NewsChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NewsChatbot: React.FC<NewsChatbotProps> = ({ isOpen = false, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email_id: "",
    contact_number: "",
    address: "",
    news_desc: "",
    file: null,
    article_type: 'text',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  // Validate file size and type
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
      };
    }
    
    const fileType = file.type;
    if (!allowedAudioTypes.includes(fileType) && !allowedVideoTypes.includes(fileType)) {
      return {
        isValid: false,
        error: `Unsupported file type. Please upload audio (MP3, WAV, OGG, M4A) or video (MP4, AVI, MOV, WMV, WEBM) files.`
      };
    }
    
    return { isValid: true };
  };

  // Determine article type based on file
  const determineArticleType = (file?: File | null): 'text' | 'audio' | 'video' => {
    if (!file) return 'text';
    
    const fileType = file.type;
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType.startsWith('video/')) return 'video';
    return 'text';
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const missingFields: string[] = [];

    // Required fields validation - only Name, Email, and News Description are mandatory
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
      missingFields.push("Full Name");
    }

    // Email is now mandatory
    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email address is required";
      missingFields.push("Email Address");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
      newErrors.email_id = "Please enter a valid email address";
    }

    // Phone number is optional, but validate format if provided
    if (formData.contact_number.trim() && !/^[\+]?[\d\s\-\(\)]{7,15}$/.test(formData.contact_number)) {
      newErrors.contact_number = "Please enter a valid phone number";
    }

    // News description is mandatory
    if (!formData.news_desc.trim()) {
      newErrors.news_desc = "News description is required";
      missingFields.push("News Description");
    }

    setErrors(newErrors);
    
    // Show validation summary if there are missing required fields
    if (missingFields.length > 0) {
      setSubmitError(`Please fill in all required fields: ${missingFields.join(", ")}. These fields cannot be empty.`);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        setSubmitError(validation.error || 'Invalid file');
        return;
      }
      
      // Determine article type
      const articleType = determineArticleType(file);
      
      setFormData(prev => ({ 
        ...prev, 
        file, 
        article_type: articleType 
      }));
      
      // Clear any previous errors
      setSubmitError("");
    } else {
      setFormData(prev => ({ 
        ...prev, 
        file: null, 
        article_type: 'text' 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(""); // Clear any previous errors
    
    try {
      // Prepare data for API with default values for optional fields
      const apiData = {
        full_name: formData.full_name,
        email_id: formData.email_id,
        contact_number: formData.contact_number || "Not provided",
        address: formData.address || "Not provided",
        news_desc: formData.news_desc,
        file: formData.file || undefined,
        article_type: formData.article_type,
      };

      console.log("Submitting user chatbot article via post_user_chatbot_article API:", apiData);
      
      // Call the post_user_chatbot_article API
      const response = await userChatbotApiService.postUserChatbotArticle(apiData);
      
      // Handle success - be more flexible with response format
      // Consider it successful if:
      // 1. response.success is explicitly true
      // 2. response.success is undefined but we got a response object
      // 3. response exists and doesn't have an error message
      const isSuccess = response && (
        response.success === true || 
        (response.success === undefined && response.message !== "Failed to submit article") ||
        (!response.success && !response.message?.includes("error") && !response.message?.includes("failed"))
      );
      
      if (isSuccess) {
        console.log("Media uploaded successfully via chatbot API:", response);
        setSubmitted(true);
        
        // Reset form data
        setFormData({
          full_name: "",
          email_id: "",
          contact_number: "",
          address: "",
          news_desc: "",
          file: null,
          article_type: 'text',
        });
        setSubmitError("");
        setRetryCount(0);
      } else {
        throw new Error(response?.message || "Failed to submit article");
      }
    } catch (error: any) {
      console.error("Error submitting user chatbot article:", error);
      console.error("Full error object:", {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        response: error?.response?.data,
        config: error?.config,
        stack: error?.stack
      });
      
      // Use the error message from the API service if available
      let errorMessage = error?.message || "Failed to submit your article. Please try again.";
      
      // Add additional context for common issues
      if (error?.status === 0) {
        errorMessage = "Unable to connect to the server. Please ensure your backend server is running on port 8000 and try again.";
      } else if (error?.status === 404) {
        errorMessage = "Chatbot API endpoint not found. Please check if the backend server is running and the endpoint is correct.";
      } else if (error?.status === 500) {
        errorMessage = "Server error occurred. Please try again later or contact support.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid data provided. Please check your form inputs and try again.";
      } else if (error?.status === 401) {
        errorMessage = "Authentication required. Please refresh the page and try again.";
      } else if (error?.status === 403) {
        errorMessage = "Access denied. Please contact support.";
      } else if (error?.code === 'NETWORK_ERROR') {
        errorMessage = "Network error - please check your internet connection and ensure the backend server is running.";
      } else if (error?.code === 'TIMEOUT') {
        errorMessage = "Request timed out. Please try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = `Server response: ${error.response.data.message}`;
      } else if (error?.response?.data?.detail) {
        errorMessage = `Server response: ${error.response.data.detail}`;
      }
      
      setSubmitError(errorMessage);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSubmitted(false);
    onToggle?.();
  };

  if (submitted) {
    return (
      <div className="position-fixed bottom-0 end-0 p-2 p-md-3" style={{ zIndex: 1050 }}>
        <div className="card shadow-lg border-0" style={{ width: "min(400px, 95vw)", borderRadius: "12px" }}>
          {/* Header with close button */}
          <div 
            className="text-white p-3 d-flex justify-content-between align-items-center"
            style={{ 
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              borderRadius: "12px 12px 0 0"
            }}
          >
            <div>
              <h6 className="mb-0 fw-bold">Success!</h6>
            </div>
            <button
              className="btn btn-sm btn-outline-light rounded-circle"
              onClick={handleClose}
              style={{ width: "32px", height: "32px", padding: "0" }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="card-body text-center p-3 p-md-4">
            <div className="text-success mb-3 mb-md-4">
              <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem" }}></i>
            </div>
            <h5 className="card-title fw-bold mb-2 mb-md-3">Thank You!</h5>
            <p className="card-text text-muted mb-3 mb-md-4" style={{ fontSize: "0.9rem" }}>
              Thanks for posting your story. Your article will be published soon!
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button 
                className="btn btn-outline-primary"
                onClick={() => setSubmitted(false)}
                style={{ borderRadius: "8px" }}
              >
                Submit Another
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleClose}
                style={{ 
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="position-fixed bottom-0 end-0 p-2 p-md-3" style={{ zIndex: 1050 }}>
      <div 
        className="card shadow-lg border-0" 
        style={{ 
          width: isExpanded ? "min(450px, 95vw)" : "70px", 
          maxHeight: isExpanded ? "min(85vh, 600px)" : "auto",
          transition: "all 0.3s ease",
          borderRadius: "12px"
        }}
      >
        {!isExpanded ? (
          <div className="card-body p-2 p-md-3 text-center">
            <button
              className="btn btn-primary rounded-circle shadow-sm"
              onClick={toggleExpanded}
              style={{ 
                width: "45px", 
                height: "45px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
              }}
            >
              <i className="bi bi-cloud-upload fs-6"></i>
            </button>
            <div className="mt-2 mt-md-3">
              <small className="text-muted d-block fw-medium" style={{ fontSize: "0.7rem", lineHeight: "1.3" }}>
                Share Your News
              </small>
              <small className="text-muted d-block d-md-block" style={{ fontSize: "0.65rem", lineHeight: "1.2" }}>
                Upload articles, audio, or video
              </small>
            </div>
          </div>
        ) : (
          <div className="card-body p-0" style={{ maxHeight: "min(85vh, 600px)", overflowY: "auto" }}>
            {/* Header */}
            <div 
              className="text-white p-3 p-md-4 d-flex justify-content-between align-items-center"
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px 12px 0 0"
              }}
            >
              <div>
                <h6 className="mb-1 fw-bold">Share Your News</h6>
                <small className="opacity-90 d-none d-md-block">Tell us your story and reach thousands of readers</small>
              </div>
              <button
                className="btn btn-sm btn-outline-light rounded-circle"
                onClick={toggleExpanded}
                style={{ width: "32px", height: "32px", padding: "0" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4">

              {/* Error Message */}
              {submitError && (
                <div className={`alert ${submitError.includes('required fields') ? 'alert-warning' : 'alert-danger'} mb-4 border-0 shadow-sm`} role="alert" style={{ borderRadius: "12px" }}>
                  <div className="d-flex align-items-start">
                    <AlertCircle size={20} className={`me-3 mt-1 ${submitError.includes('required fields') ? 'text-warning' : 'text-danger'}`} />
                    <div className="flex-grow-1">
                      <strong className="d-block mb-1">
                        {submitError.includes('required fields') ? 'Required Fields Missing' : 'Submission Failed'}
                      </strong>
                      <div className="mb-2">{submitError}</div>
                      {submitError.includes('required fields') && (
                        <div className="small text-muted">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Please fill in all mandatory fields marked with * to continue
                        </div>
                      )}
                      {retryCount > 0 && !submitError.includes('required fields') && (
                        <div className="small text-muted">
                          Attempt {retryCount + 1} of 3
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {retryCount < 3 && !submitError.includes('required fields') && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            setSubmitError("");
                            handleSubmit(new Event('submit') as any);
                          }}
                          disabled={isSubmitting}
                          style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                        >
                          <i className="bi bi-arrow-clockwise me-1"></i>
                          Retry
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-close btn-close-sm"
                        onClick={() => {
                          setSubmitError("");
                          setRetryCount(0);
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <User size={18} className="me-2 text-primary" />
                  Full Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={{ 
                    borderRadius: "12px", 
                    border: errors.full_name ? "2px solid #dc3545" : "2px solid #e9ecef",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                />
                {errors.full_name && (
                  <div className="invalid-feedback mt-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2 text-danger"></i>
                    <span className="fw-medium">{errors.full_name}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <Mail size={18} className="me-2 text-primary" />
                  Email Address *
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email_id ? "is-invalid" : ""}`}
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  style={{ 
                    borderRadius: "12px", 
                    border: errors.email_id ? "2px solid #dc3545" : "2px solid #e9ecef",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                />
                {errors.email_id && (
                  <div className="invalid-feedback mt-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2 text-danger"></i>
                    <span className="fw-medium">{errors.email_id}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <Phone size={18} className="me-2 text-primary" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.contact_number ? "is-invalid" : ""}`}
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (optional)"
                  style={{ 
                    borderRadius: "12px", 
                    border: errors.contact_number ? "2px solid #dc3545" : "2px solid #e9ecef",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                />
                {errors.contact_number && (
                  <div className="invalid-feedback mt-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2 text-danger"></i>
                    <span className="fw-medium">{errors.contact_number}</span>
                  </div>
                )}
                <small className="text-muted mt-2 d-block">
                  <i className="bi bi-info-circle me-1"></i>
                  Phone number is optional but recommended for better communication
                </small>
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <MapPin size={18} className="me-2 text-primary" />
                  Address (Optional)
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  style={{ 
                    borderRadius: "12px", 
                    border: errors.address ? "2px solid #dc3545" : "2px solid #e9ecef",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                />
                {errors.address && (
                  <div className="invalid-feedback mt-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2 text-danger"></i>
                    <span className="fw-medium">{errors.address}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <FileText size={18} className="me-2 text-primary" />
                  News Description *
                </label>
                <textarea
                  className={`form-control ${errors.news_desc ? "is-invalid" : ""}`}
                  name="news_desc"
                  value={formData.news_desc}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your news story in detail..."
                  style={{ 
                    borderRadius: "12px", 
                    border: errors.news_desc ? "2px solid #dc3545" : "2px solid #e9ecef",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                    resize: "vertical",
                    transition: "all 0.3s ease"
                  }}
                />
                {errors.news_desc && (
                  <div className="invalid-feedback mt-2 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2 text-danger"></i>
                    <span className="fw-medium">{errors.news_desc}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center fw-semibold text-dark mb-2">
                  <Upload size={18} className="me-2 text-primary" />
                  Upload Media (Optional)
                </label>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    style={{ 
                      borderRadius: "12px", 
                      border: "2px solid #e9ecef",
                      padding: "12px 16px",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease"
                    }}
                  />
                </div>
                
                {/* File size information */}
                <div className="mb-3">
                  <small className="text-muted d-flex align-items-center">
                    <i className="bi bi-info-circle me-2"></i>
                    <span><strong>Supported formats:</strong> Audio (MP3, WAV, OGG, M4A) or Video (MP4, AVI, MOV, WMV, WEBM)</span>
                  </small>
                  <small className="text-muted d-flex align-items-center mt-1">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <span><strong>Size limit:</strong> Maximum 50MB per file</span>
                  </small>
                </div>
                
                {formData.file && (
                  <div className={`alert py-3 px-3 mb-0 ${formData.article_type === 'audio' ? 'alert-success' : formData.article_type === 'video' ? 'alert-warning' : 'alert-info'}`} style={{ borderRadius: "12px", fontSize: "0.9rem" }}>
                    <div className="d-flex align-items-center">
                      <i className={`bi ${formData.article_type === 'audio' ? 'bi-mic' : formData.article_type === 'video' ? 'bi-camera-video' : 'bi-file-earmark'} me-2`}></i>
                      <div className="flex-grow-1">
                        <strong>Selected {formData.article_type.toUpperCase()}:</strong> {formData.file.name}
                        <span className="text-muted ms-2">({(formData.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 d-flex align-items-center justify-content-center fw-semibold"
                disabled={isSubmitting}
                style={{
                  background: Object.keys(errors).length > 0 ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 24px",
                  fontSize: "1rem",
                  boxShadow: Object.keys(errors).length > 0 ? "0 4px 15px rgba(220, 53, 69, 0.3)" : "0 4px 15px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  color: "white"
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = Object.keys(errors).length > 0 ? "0 6px 20px rgba(220, 53, 69, 0.4)" : "0 6px 20px rgba(102, 126, 234, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = Object.keys(errors).length > 0 ? "0 4px 15px rgba(220, 53, 69, 0.3)" : "0 4px 15px rgba(102, 126, 234, 0.3)";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Submitting Your News...</span>
                  </>
                ) : Object.keys(errors).length > 0 ? (
                  <>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <span>Fill Required Fields</span>
                  </>
                ) : (
                  <>
                    <Send size={18} className="me-2" />
                    <span>Submit Your News</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsChatbot;
