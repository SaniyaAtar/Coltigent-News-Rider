import React, { useState } from 'react';

const ErrorChecker: React.FC = () => {
  const [errorInfo, setErrorInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForErrors = async () => {
    setIsChecking(true);
    const errors: any = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        online: navigator.onLine,
      },
      apiConfig: {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        expectedBaseURL: 'http://localhost:8000/api/v1',
      },
      tests: {}
    };

    try {
      // Test 1: Basic connectivity
      console.log('🔍 Testing basic connectivity...');
      try {
        const response = await fetch('http://localhost:8000', { 
          method: 'GET',
          timeout: 5000 
        });
        errors.tests.basicConnectivity = {
          success: true,
          status: response.status,
          message: 'Backend server is reachable'
        };
      } catch (error: any) {
        errors.tests.basicConnectivity = {
          success: false,
          error: error.message,
          message: 'Backend server is not reachable'
        };
      }

      // Test 2: API health check
      console.log('🔍 Testing API health...');
      try {
        const response = await fetch('http://localhost:8000/api/v1/health', { 
          method: 'GET',
          timeout: 5000 
        });
        errors.tests.apiHealth = {
          success: true,
          status: response.status,
          message: 'API health check passed'
        };
      } catch (error: any) {
        errors.tests.apiHealth = {
          success: false,
          error: error.message,
          message: 'API health check failed'
        };
      }

      // Test 3: Chatbot endpoint
      console.log('🔍 Testing chatbot endpoint...');
      try {
        const response = await fetch('http://localhost:8000/api/v1/news/upload_chatbot_media', { 
          method: 'OPTIONS',
          timeout: 5000 
        });
        errors.tests.chatbotEndpoint = {
          success: true,
          status: response.status,
          message: 'Chatbot endpoint is accessible'
        };
      } catch (error: any) {
        errors.tests.chatbotEndpoint = {
          success: false,
          error: error.message,
          message: 'Chatbot endpoint is not accessible'
        };
      }

      // Test 4: Check localStorage
      console.log('🔍 Checking localStorage...');
      const token = localStorage.getItem('access_token');
      errors.tests.localStorage = {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        message: token ? 'Authentication token found' : 'No authentication token'
      };

      // Test 5: Check for console errors
      console.log('🔍 Checking for console errors...');
      const originalError = console.error;
      const errors: string[] = [];
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };

      // Restore console.error after a short delay
      setTimeout(() => {
        console.error = originalError;
        errors.tests.consoleErrors = {
          hasErrors: errors.length > 0,
          errorCount: errors.length,
          errors: errors,
          message: errors.length > 0 ? `${errors.length} console errors found` : 'No console errors'
        };
      }, 1000);

    } catch (error: any) {
      errors.generalError = {
        message: error.message,
        stack: error.stack
      };
    }

    setErrorInfo(errors);
    setIsChecking(false);
  };

  const getStatusIcon = (success: boolean) => success ? '✅' : '❌';
  const getStatusColor = (success: boolean) => success ? 'text-success' : 'text-danger';

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">🚨 Error Checker</h5>
        </div>
        <div className="card-body">
          <button
            className="btn btn-warning"
            onClick={checkForErrors}
            disabled={isChecking}
          >
            {isChecking ? 'Checking for Errors...' : 'Check for Errors'}
          </button>

          {errorInfo && (
            <div className="mt-4">
              <h6>🔍 Error Analysis Results</h6>
              
              <div className="row">
                <div className="col-md-6">
                  <h6>Environment Info</h6>
                  <ul className="list-unstyled">
                    <li><strong>URL:</strong> {errorInfo.environment?.url}</li>
                    <li><strong>Online:</strong> {errorInfo.environment?.online ? 'Yes' : 'No'}</li>
                    <li><strong>API Base URL:</strong> {errorInfo.apiConfig?.VITE_API_BASE_URL || 'Not set'}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Test Results</h6>
                  {errorInfo.tests && Object.entries(errorInfo.tests).map(([key, test]: [string, any]) => (
                    <div key={key} className="mb-2">
                      <span className={getStatusColor(test.success)}>
                        {getStatusIcon(test.success)} {test.message}
                      </span>
                      {test.error && (
                        <div className="text-muted small">
                          Error: {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <h6>🔧 Quick Fixes</h6>
                <div className="alert alert-info">
                  <strong>Common Solutions:</strong>
                  <ul className="mb-0">
                    <li>Make sure your backend server is running on port 8000</li>
                    <li>Check if the endpoint <code>/api/v1/news/upload_chatbot_media</code> exists</li>
                    <li>Verify your backend server is accessible at <code>http://localhost:8000</code></li>
                    <li>Check browser console (F12) for detailed error messages</li>
                  </ul>
                </div>
              </div>

              <details className="mt-3">
                <summary>📋 Full Error Details</summary>
                <pre className="bg-light p-3 rounded mt-2" style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
                  {JSON.stringify(errorInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorChecker;
