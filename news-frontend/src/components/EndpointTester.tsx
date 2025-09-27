import React, { useState } from 'react';
import { userChatbotApiService } from '../services/userChatbotApi';

const EndpointTester: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoints = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    const results: string[] = [];
    
    // Test backend connectivity
    try {
      const isConnected = await userChatbotApiService.testBackendConnection();
      results.push(`✅ Backend connectivity: ${isConnected ? 'Connected' : 'Failed'}`);
    } catch (error: any) {
      results.push(`❌ Backend connectivity: ${error.message}`);
    }
    
    // Test the post_user_chatbot_article endpoint
    const testEndpoints = [
      '/api/v1/news/post_user_chatbot_article'
    ];
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        results.push(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error: any) {
        results.push(`❌ ${endpoint}: ${error.message}`);
      }
    }
    
    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1070 }}>
      <div className="card shadow-sm" style={{ minWidth: '400px', maxHeight: '400px', overflowY: 'auto' }}>
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="card-title mb-0">Endpoint Tester</h6>
            <button 
              className="btn btn-sm btn-primary"
              onClick={testEndpoints}
              disabled={isTesting}
            >
              {isTesting ? 'Testing...' : 'Test Endpoints'}
            </button>
          </div>
          
          {testResults.length > 0 && (
            <div>
              <h6 className="mb-2">Test Results:</h6>
              <div style={{ fontSize: '0.8rem' }}>
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndpointTester;
