import React, { useState } from 'react';
import { userChatbotApiService } from '../services/userChatbotApi';

const ChatbotDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testFile, setTestFile] = useState<File | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        NODE_ENV: import.meta.env.NODE_ENV,
        currentUrl: window.location.href,
      },
      apiClient: {
        baseURL: 'http://localhost:8000/api/v1', // Default from apiClient
        timeout: 30000,
      },
      endpoint: '/news/upload_chatbot_media',
      fullUrl: 'http://localhost:8000/api/v1/news/upload_chatbot_media',
    };

    try {
      // Test 1: Backend connectivity
      console.log('🔍 Testing backend connectivity...');
      const isBackendReachable = await userChatbotApiService.testBackendConnection();
      diagnostics.backendConnectivity = {
        reachable: isBackendReachable,
        testTime: new Date().toISOString(),
      };

      // Test 1.5: Specific chatbot endpoint test
      console.log('🔍 Testing chatbot endpoint...');
      const endpointTest = await userChatbotApiService.testChatbotEndpoint();
      diagnostics.chatbotEndpoint = endpointTest;

      // Test 2: Test with sample data (no file)
      console.log('🔍 Testing API with sample data...');
      const testData = {
        full_name: 'Test User',
        email_id: 'test@example.com',
        contact_number: '1234567890',
        address: 'Test Address',
        news_desc: 'This is a test news description for debugging purposes.',
        article_type: 'text' as const,
      };

      try {
        const response = await userChatbotApiService.postUserChatbotArticle(testData);
        diagnostics.sampleDataTest = {
          success: true,
          response: response,
          status: 'Success',
        };
      } catch (error: any) {
        diagnostics.sampleDataTest = {
          success: false,
          error: {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            response: error.response?.data,
          },
        };
      }

      // Test 3: Test with file if available
      if (testFile) {
        console.log('🔍 Testing API with file upload...');
        const fileTestData = {
          ...testData,
          file: testFile,
          article_type: testFile.type.startsWith('audio/') ? 'audio' as const : 'video' as const,
        };

        try {
          const fileResponse = await userChatbotApiService.postUserChatbotArticle(fileTestData);
          diagnostics.fileUploadTest = {
            success: true,
            response: fileResponse,
            fileInfo: {
              name: testFile.name,
              type: testFile.type,
              size: testFile.size,
              sizeMB: (testFile.size / 1024 / 1024).toFixed(2),
            },
          };
        } catch (error: any) {
          diagnostics.fileUploadTest = {
            success: false,
            error: {
              message: error.message,
              status: error.status,
              statusText: error.statusText,
              response: error.response?.data,
            },
            fileInfo: {
              name: testFile.name,
              type: testFile.type,
              size: testFile.size,
              sizeMB: (testFile.size / 1024 / 1024).toFixed(2),
            },
          };
        }
      }

      // Test 4: Network information
      diagnostics.networkInfo = {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        connection: (navigator as any).connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
        } : 'Not available',
      };

    } catch (error: any) {
      diagnostics.generalError = {
        message: error.message,
        stack: error.stack,
      };
    }

    setDebugInfo(diagnostics);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestFile(file);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">🔧 Chatbot Upload Debugger</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Test File (Optional)</label>
            <input
              type="file"
              className="form-control"
              accept="audio/*,video/*"
              onChange={handleFileChange}
            />
            {testFile && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {testFile.name} ({testFile.type}, {(testFile.size / 1024 / 1024).toFixed(2)}MB)
                </small>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={runDiagnostics}
            disabled={isLoading}
          >
            {isLoading ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </button>

          {debugInfo && (
            <div className="mt-4">
              <h6>🔍 Diagnostic Results</h6>
              <pre className="bg-light p-3 rounded" style={{ fontSize: '12px', maxHeight: '500px', overflow: 'auto' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4">
            <h6>📋 What to Check:</h6>
            <ul className="list-unstyled">
              <li>✅ <strong>Backend Connectivity:</strong> Should show "reachable: true"</li>
              <li>✅ <strong>Sample Data Test:</strong> Should show "success: true"</li>
              <li>✅ <strong>File Upload Test:</strong> Should show "success: true" if file selected</li>
              <li>✅ <strong>Status Codes:</strong> Look for 201 status codes, not 404 or 500</li>
              <li>✅ <strong>Response Data:</strong> Should contain media_s3_url field</li>
            </ul>
          </div>

          <div className="mt-3">
            <h6>🚨 Common Issues:</h6>
            <ul className="list-unstyled">
              <li>❌ <strong>404 Error:</strong> Backend endpoint doesn't exist</li>
              <li>❌ <strong>500 Error:</strong> Backend server error</li>
              <li>❌ <strong>Network Error:</strong> Backend server not running</li>
                <li>❌ <strong>File Size:</strong> File too large (&gt;50MB)</li>
              <li>❌ <strong>File Type:</strong> Unsupported file format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotDebugger;
