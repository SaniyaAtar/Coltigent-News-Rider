// Simple backend test script
// Run with: node test-backend-simple.js

const axios = require('axios');

async function testBackend() {
  console.log('🔍 Testing Backend Server...\n');

  const tests = [
    {
      name: 'Basic Server',
      url: 'http://localhost:8000',
      method: 'GET'
    },
    {
      name: 'API Health',
      url: 'http://localhost:8000/api/v1/health',
      method: 'GET'
    },
    {
      name: 'Chatbot Endpoint',
      url: 'http://localhost:8000/api/v1/news/upload_chatbot_media',
      method: 'OPTIONS'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000
      });
      
      console.log(`✅ ${test.name}: OK (Status: ${response.status})`);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${test.name}: Backend server not running`);
      } else if (error.response) {
        console.log(`⚠️  ${test.name}: Status ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
  }

  console.log('\n📋 Results:');
  console.log('✅ = Working');
  console.log('⚠️  = Endpoint exists but may have issues');
  console.log('❌ = Not working');
  
  console.log('\n🔧 If you see ❌ errors:');
  console.log('1. Make sure your backend server is running on port 8000');
  console.log('2. Check if the endpoint exists in your backend');
  console.log('3. Verify your backend server is accessible');
}

testBackend().catch(console.error);
