import React from 'react';

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  if (!error) return null;

  const getErrorMessage = (error: ApiError): string => {
    if (error.status === 0) {
      return 'Network error - please check your internet connection';
    }
    
    if (error.status === 404) {
      return 'The requested resource was not found';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to access this resource';
    }
    
    if (error.status === 401) {
      return 'Please log in to access this resource';
    }
    
    if (error.status >= 500) {
      return 'Server error - please try again later';
    }
    
    return error.message || 'An unexpected error occurred';
  };

  const getErrorIcon = (status: number): string => {
    if (status === 0) return 'bi-wifi-off';
    if (status === 404) return 'bi-search';
    if (status === 403) return 'bi-shield-exclamation';
    if (status === 401) return 'bi-person-x';
    if (status >= 500) return 'bi-server';
    return 'bi-exclamation-triangle';
  };

  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <i className={`bi ${getErrorIcon(error.status)} me-2`}></i>
        <div className="flex-grow-1">
          <strong>Error:</strong> {getErrorMessage(error)}
        </div>
        {onRetry && (
          <button
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={onRetry}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
