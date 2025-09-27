// Simple script to test if backend server is running
// Run this with: node test-backend.js

import http from 'http';

const testEndpoints = [
  'http://localhost:8000',
  'http://localhost:8000/api/v1',
  'http://localhost:8000/api/v1/health',
  'http://localhost:8000/api/v1/news',
  'http://localhost:8000/api/v1/news/user_chatbot_articles'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${url}: ${res.statusCode} ${res.statusMessage}`);
      resolve({ url, status: res.statusCode, success: true });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${url}: ${err.message}`);
      resolve({ url, status: 0, success: false, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${url}: Timeout`);
      req.destroy();
      resolve({ url, status: 0, success: false, error: 'Timeout' });
    });
  });
}

async function testBackend() {
  console.log('🔍 Testing backend server connectivity...\n');
  
  const results = [];
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length === 0) {
    console.log('\n🚨 Backend server is not running!');
    console.log('Please start your backend server on port 8000 and try again.');
  } else {
    console.log('\n✅ Backend server is running!');
    console.log('Working endpoints:');
    successful.forEach(r => console.log(`  - ${r.url}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed endpoints:');
    failed.forEach(r => console.log(`  - ${r.url}: ${r.error}`));
  }
}

testBackend().catch(console.error);
