# 🚨 Chatbot Error Troubleshooting Guide

## 🔍 **Step 1: Identify the Error**

### **What error are you seeing?**

1. **Browser Console Error** (F12 → Console tab)
2. **Network Error** (F12 → Network tab)
3. **Form Submission Error** (on the chatbot form)
4. **Backend Server Error** (in your backend logs)

## 🚨 **Common Error Types & Solutions**

### **❌ Error: "Network Error" or "Failed to fetch"**
**Cause**: Backend server is not running
**Solution**:
```bash
# Start your backend server
cd your-backend-directory
python manage.py runserver 8000
# OR
npm start
# OR
uvicorn main:app --host 0.0.0.0 --port 8000
```

### **❌ Error: "404 Not Found"**
**Cause**: Endpoint doesn't exist
**Solution**:
- Check if your backend has the endpoint: `/api/v1/news/upload_chatbot_media`
- Verify the endpoint is properly configured in your backend

### **❌ Error: "500 Internal Server Error"**
**Cause**: Backend server error
**Solution**:
- Check your backend server logs
- Verify database connection
- Check file upload configuration

### **❌ Error: "CORS Error"**
**Cause**: Cross-origin request blocked
**Solution**:
- Add CORS configuration to your backend
- Allow requests from `http://localhost:5173`

### **❌ Error: "File too large"**
**Cause**: File exceeds 50MB limit
**Solution**:
- Use a smaller file (under 50MB)
- Check file size before upload

### **❌ Error: "Unsupported file type"**
**Cause**: File format not supported
**Solution**:
- Use supported formats:
  - **Audio**: MP3, WAV, OGG, M4A
  - **Video**: MP4, AVI, MOV, WMV, WEBM

## 🔧 **Step 2: Use the Error Checker**

1. **Go to Contact page**: `http://localhost:5173/contact`
2. **Scroll down** to "🚨 Error Checker"
3. **Click "Check for Errors"**
4. **Review the results** - it will show you exactly what's wrong

## 🔧 **Step 3: Check Browser Console**

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Try submitting the chatbot form**
4. **Look for error messages** in red

## 🔧 **Step 4: Check Network Tab**

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Try submitting the chatbot form**
4. **Look for failed requests** (red entries)
5. **Click on failed requests** to see error details

## 🔧 **Step 5: Test Backend Manually**

### **Test 1: Check if backend is running**
```bash
curl http://localhost:8000
```

### **Test 2: Check API health**
```bash
curl http://localhost:8000/api/v1/health
```

### **Test 3: Test chatbot endpoint**
```bash
curl -X OPTIONS http://localhost:8000/api/v1/news/upload_chatbot_media
```

## 📋 **Quick Checklist**

- [ ] Backend server is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] No firewall blocking connections
- [ ] Backend has the correct endpoint
- [ ] File size is under 50MB
- [ ] File format is supported
- [ ] No CORS issues

## 🚀 **Step 6: Use the Debugger**

1. **Go to Contact page**: `http://localhost:5173/contact`
2. **Scroll down** to "🔧 Chatbot Upload Debugger"
3. **Click "Run Diagnostics"**
4. **Review the detailed results**

## 📞 **Still Having Issues?**

**Please share:**
1. **Exact error message** from browser console
2. **Status code** from Network tab
3. **Backend server status** (running/not running)
4. **Error Checker results**

**The Error Checker will tell you exactly what's wrong!** 🚀
