# Chatbot Troubleshooting Guide

## Issue: Chatbot Unable to Insert Records

### 🔍 **Root Causes Identified:**

1. **Backend Server Not Running**
   - The API client is configured to connect to `http://localhost:8000/api/v1`
   - If your backend server isn't running on port 8000, all requests will fail

2. **API Endpoint Mismatch**
   - Chatbot tries to reach: `/api/user-chatbot/post_user_chatbot_article`
   - Main API base URL: `http://localhost:8000/api/v1`
   - This creates malformed URL: `http://localhost:8000/api/v1/api/user-chatbot/post_user_chatbot_article`

3. **Missing Environment Configuration**
   - No `.env` file existed (now created)
   - API endpoints not properly configured

### 🛠️ **Fixes Applied:**

#### 1. **Environment Configuration**
- Created `.env` file with proper API configuration
- Added `VITE_CHATBOT_API_URL=/api/user-chatbot`

#### 2. **Enhanced API Service**
- Added backend connectivity testing
- Multiple endpoint fallback mechanism
- Comprehensive error logging
- Alternative endpoint attempts

#### 3. **Backend Status Monitor**
- Added `BackendStatus` component to monitor backend connectivity
- Real-time status indicator in the top-right corner
- Manual refresh capability

### 🚀 **How to Fix Your Issue:**

#### **Step 1: Start Your Backend Server**
```bash
# Make sure your backend server is running on port 8000
# Check if you have a backend server running
curl http://localhost:8000/api/v1/health
```

#### **Step 2: Verify Backend Endpoints**
Your backend should have these endpoints:
- `POST /api/v1/api/user-chatbot/post_user_chatbot_article`
- OR `POST /api/v1/user-chatbot/post_user_chatbot_article`
- OR `POST /api/v1/post_user_chatbot_article`

#### **Step 3: Check Backend Status**
- Look at the "Backend Status" indicator in the top-right corner
- If it shows "Offline", your backend server is not running
- Click the refresh button to test connectivity

#### **Step 4: Test the Chatbot**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try submitting the chatbot form
4. Check console logs for detailed error information

### 🔧 **Backend Requirements:**

Your backend server should:
1. **Run on port 8000**
2. **Accept POST requests** to the chatbot endpoint
3. **Handle multipart/form-data** for file uploads
4. **Return JSON response** with this structure:
```json
{
  "success": true,
  "message": "Article submitted successfully",
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": "User Address",
    "message": "News content",
    "file_url": "https://example.com/file.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 📋 **Common Solutions:**

#### **If Backend is Offline:**
1. Start your backend server
2. Ensure it's running on port 8000
3. Check if the server is accessible at `http://localhost:8000`

#### **If Endpoint Not Found (404):**
1. Check your backend routes
2. Ensure the chatbot endpoint exists
3. Verify the endpoint path matches the expected format

#### **If Server Error (500):**
1. Check backend server logs
2. Verify database connection
3. Ensure all required fields are handled

#### **If Network Error:**
1. Check your internet connection
2. Verify firewall settings
3. Ensure no proxy is blocking requests

### 🐛 **Debug Information:**

The enhanced chatbot now provides:
- **Detailed console logging** of all API attempts
- **Multiple endpoint testing** with fallback mechanisms
- **Real-time backend status** monitoring
- **Specific error messages** for different failure types

### 📞 **Still Having Issues?**

1. **Check Console Logs**: Open browser dev tools and look for detailed error messages
2. **Verify Backend**: Ensure your backend server is running and accessible
3. **Test Endpoints**: Use tools like Postman to test your backend endpoints directly
4. **Check Network**: Verify no network issues are blocking the requests

The chatbot will now try multiple endpoint configurations and provide detailed error information to help identify the exact issue.
