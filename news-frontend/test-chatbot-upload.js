#!/usr/bin/env node

// Simple test script to verify chatbot upload functionality
// Run with: node test-chatbot-upload.js

const axios = require('axios');
const FormData = require('form-data');

console.log('🚀 Chatbot Upload Test Script');
console.log('============================\n');

async function testChatbotUpload() {
  const baseURL = 'http://localhost:8000/api/v1';
  const endpoint = '/news/upload_chatbot_media';
  const fullURL = `${baseURL}${endpoint}`;

  console.log(`📍 Testing URL: ${fullURL}\n`);

  // Test 1: Check if backend is running
  console.log('1️⃣ Checking backend server...');
  try {
    const healthCheck = await axios.get(`${baseURL}/health`, { timeout: 5000 });
    console.log('✅ Backend server is running');
    console.log(`   Status: ${healthCheck.status}`);
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log(`   Error: ${error.message}`);
    console.log('\n🔧 Please start your backend server on port 8000');
    return;
  }

  // Test 2: Check if endpoint exists
  console.log('\n2️⃣ Checking endpoint availability...');
  try {
    const optionsResponse = await axios.options(fullURL, { timeout: 5000 });
    console.log('✅ Endpoint is accessible');
    console.log(`   Status: ${optionsResponse.status}`);
  } catch (error) {
    console.log('❌ Endpoint is not accessible');
    console.log(`   Error: ${error.message}`);
    console.log('\n🔧 Please check if the endpoint exists in your backend');
    return;
  }

  // Test 3: Test with sample data
  console.log('\n3️⃣ Testing with sample data...');
  try {
    const formData = new FormData();
    formData.append('full_name', 'Test User');
    formData.append('email_id', 'test@example.com');
    formData.append('contact_number', '1234567890');
    formData.append('address', 'Test Address');
    formData.append('news_desc', 'This is a test news description for debugging purposes.');
    formData.append('article_type', 'text');

    const response = await axios.post(fullURL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });

    console.log('✅ Sample data test successful');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.log('❌ Sample data test failed');
    console.log(`   Status: ${error.response?.status || 'No response'}`);
    console.log(`   Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }

  console.log('\n🏁 Test completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. If all tests pass, try uploading a file through the frontend');
  console.log('   2. If tests fail, check the error messages above');
  console.log('   3. Make sure your backend server is running on port 8000');
  console.log('   4. Verify the endpoint /api/v1/news/upload_chatbot_media exists');
}

// Run the test
testChatbotUpload().catch(console.error);
