// Simple Node.js script to test the chatbot API endpoint
// Run with: node debug-chatbot.js

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testChatbotAPI() {
  console.log('🔍 Testing Chatbot API Endpoint...\n');

  const baseURL = 'http://localhost:8000/api/v1';
  const endpoint = '/news/upload_chatbot_media';
  const fullURL = `${baseURL}${endpoint}`;

  console.log(`📍 Testing URL: ${fullURL}\n`);

  // Test 1: Check if backend is reachable
  console.log('1️⃣ Testing backend connectivity...');
  try {
    const healthResponse = await axios.get(`${baseURL}/health`, { timeout: 5000 });
    console.log('✅ Backend is reachable');
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data)}\n`);
  } catch (error) {
    console.log('❌ Backend is not reachable');
    console.log(`   Error: ${error.message}\n`);
    return;
  }

  // Test 2: Test with sample data (no file)
  console.log('2️⃣ Testing API with sample data (no file)...');
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
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
  } catch (error) {
    console.log('❌ Sample data test failed');
    console.log(`   Status: ${error.response?.status || 'No response'}`);
    console.log(`   Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    console.log('');
  }

  // Test 3: Test with a small test file (if available)
  console.log('3️⃣ Testing API with file upload...');
  try {
    // Create a small test file
    const testContent = 'This is a test file for chatbot upload debugging.';
    fs.writeFileSync('test-file.txt', testContent);

    const formData = new FormData();
    formData.append('full_name', 'Test User');
    formData.append('email_id', 'test@example.com');
    formData.append('contact_number', '1234567890');
    formData.append('address', 'Test Address');
    formData.append('news_desc', 'This is a test news description with file upload.');
    formData.append('article_type', 'text');
    formData.append('file', fs.createReadStream('test-file.txt'));

    const response = await axios.post(fullURL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });

    console.log('✅ File upload test successful');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);

    // Clean up test file
    fs.unlinkSync('test-file.txt');
  } catch (error) {
    console.log('❌ File upload test failed');
    console.log(`   Status: ${error.response?.status || 'No response'}`);
    console.log(`   Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    console.log('');

    // Clean up test file if it exists
    try {
      fs.unlinkSync('test-file.txt');
    } catch (cleanupError) {
      // File doesn't exist, ignore
    }
  }

  console.log('🏁 Testing complete!');
  console.log('\n📋 What to check:');
  console.log('   ✅ Backend should be reachable (status 200)');
  console.log('   ✅ Sample data test should succeed (status 201)');
  console.log('   ✅ File upload test should succeed (status 201)');
  console.log('   ✅ Response should contain media_s3_url field');
  console.log('\n🚨 Common issues:');
  console.log('   ❌ 404: Endpoint does not exist');
  console.log('   ❌ 500: Backend server error');
  console.log('   ❌ Network error: Backend server not running');
}

// Run the test
testChatbotAPI().catch(console.error);
