import React, { useState } from 'react';
import { trendingApiService } from '../services/trendingApi';
import type { TrendingNewsResponse } from '../types/api';

const TrendingApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    [key: string]: {
      loading: boolean;
      data: TrendingNewsResponse[];
      error: string | null;
    }
  }>({});

  const testCategories = ['tech', 'sports', 'business', 'national', 'world'];

  const testCategory = async (category: string) => {
    setTestResults(prev => ({
      ...prev,
      [category]: { loading: true, data: [], error: null }
    }));

    try {
      console.log(`Testing new API endpoint for category: ${category}`);
      const data = await trendingApiService.getTrendingNewsByCategory(category, 1, 10);
      console.log(`Successfully fetched ${data.length} articles for ${category}:`, data);
      
      setTestResults(prev => ({
        ...prev,
        [category]: { loading: false, data, error: null }
      }));
    } catch (error) {
      console.error(`Error testing ${category}:`, error);
      setTestResults(prev => ({
        ...prev,
        [category]: { 
          loading: false, 
          data: [], 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      }));
    }
  };

  const testAllCategories = async () => {
    for (const category of testCategories) {
      await testCategory(category);
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>Trending API Test - New Endpoint</h2>
          <p className="text-muted">
            Testing the new GET /news/trending/list?category_type=tech&page=1&size=10 endpoint
          </p>
          
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2"
              onClick={testAllCategories}
            >
              Test All Categories
            </button>
            {testCategories.map(category => (
              <button
                key={category}
                className="btn btn-outline-primary me-2 mb-2"
                onClick={() => testCategory(category)}
                disabled={testResults[category]?.loading}
              >
                Test {category}
                {testResults[category]?.loading && (
                  <span className="spinner-border spinner-border-sm ms-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="row">
            {testCategories.map(category => {
              const result = testResults[category];
              if (!result) return null;

              return (
                <div key={category} className="col-md-6 col-lg-4 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0 text-capitalize">{category}</h5>
                    </div>
                    <div className="card-body">
                      {result.loading && (
                        <div className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2">Testing API...</p>
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="alert alert-danger">
                          <strong>Error:</strong> {result.error}
                        </div>
                      )}
                      
                      {!result.loading && !result.error && (
                        <div>
                          <p className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Success! Found {result.data.length} articles
                          </p>
                          {result.data.length > 0 && (
                            <div>
                              <h6>Sample Article:</h6>
                              <div className="border p-2 rounded">
                                <strong>{result.data[0].title}</strong>
                                <br />
                                <small className="text-muted">
                                  Category: {result.data[0].category}
                                  <br />
                                  Author: {result.data[0].author}
                                </small>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <h4>API Endpoint Details</h4>
            <div className="alert alert-info">
              <strong>Endpoint:</strong> GET /news/trending/list<br />
              <strong>Parameters:</strong><br />
              • category_type: string (e.g., 'tech', 'sports', 'business')<br />
              • page: number (default: 1)<br />
              • size: number (default: 10)<br />
              <strong>Example:</strong> /news/trending/list?category_type=tech&page=1&size=10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingApiTest;
