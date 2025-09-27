import { apiClient } from './apiClient';
import axios from 'axios';

// User Chatbot API Response interfaces
export interface UserChatbotArticleRequest {
  full_name: string;
  email_id: string;
  contact_number?: string;
  address?: string;
  news_desc: string;
  file?: File;
  article_type: 'text' | 'audio' | 'video';
}

export interface UserChatbotArticleResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    full_name: string;
    email_id?: string;
    contact_number?: string;
    address?: string;
    news_desc: string;
    file_url?: string;
    media_s3_url?: string; // S3 URL for uploaded media files
    article_type: 'text' | 'audio' | 'video';
    created_at: string;
  };
}

// User Chatbot API Service
export class UserChatbotApiService {

  // Validate file size and type
  private validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
      };
    }
    
    const fileType = file.type;
    if (!allowedAudioTypes.includes(fileType) && !allowedVideoTypes.includes(fileType)) {
      return {
        isValid: false,
        error: `Unsupported file type. Please upload audio (MP3, WAV, OGG, M4A) or video (MP4, AVI, MOV, WMV, WEBM) files.`
      };
    }
    
    return { isValid: true };
  }

  // Determine article type based on file attachment
  private determineArticleType(file?: File): 'text' | 'audio' | 'video' {
    // If no file attachment, always return 'text'
    if (!file) {
      console.log('No file attachment - article_type set to: text');
      return 'text';
    }
    
    // If file is attached, determine type based on MIME type
    const fileType = file.type;
    if (fileType.startsWith('audio/')) {
      console.log('Audio file detected - article_type set to: audio');
      return 'audio';
    }
    if (fileType.startsWith('video/')) {
      console.log('Video file detected - article_type set to: video');
      return 'video';
    }
    
    // Fallback to text if file type is not recognized
    console.log('Unrecognized file type - article_type set to: text');
    return 'text';
  }

  // Test specific chatbot endpoint
  async testChatbotEndpoint(): Promise<{ success: boolean; message: string; details?: any }> {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    
    // List of possible chatbot endpoints to test
    const possibleEndpoints = [
      '/news/upload_chatbot_media',           // Primary endpoint for media uploads
      '/news/post_user_chatbot_article',      // Alternative working endpoint
      '/news/user_chatbot_articles',          // Alternative endpoint from docs
      '/user-chatbot/post_user_chatbot_article', // Another possible endpoint
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const fullURL = `${baseURL}${endpoint}`;
        console.log('Testing chatbot endpoint:', fullURL);
        
        // Try a simple OPTIONS request first to check if endpoint exists
        const response = await fetch(fullURL, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok || response.status === 405) { // 405 = Method Not Allowed (but endpoint exists)
          return {
            success: true,
            message: `Endpoint accessible: ${endpoint} (Status: ${response.status})`,
            details: {
              url: fullURL,
              endpoint: endpoint,
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            }
          };
        }
      } catch (error: any) {
        console.log(`Endpoint ${endpoint} not accessible:`, error.message);
      }
    }

    return {
      success: false,
      message: `No chatbot endpoints accessible. Tried: ${possibleEndpoints.join(', ')}`,
      details: {
        testedEndpoints: possibleEndpoints,
        baseURL: baseURL
      }
    };
  }

  // Test backend connectivity
  async testBackendConnection(): Promise<boolean> {
    try {
      const mainBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      console.log('Testing backend connection to:', mainBaseUrl);
      
      // Try to reach the backend with multiple endpoints
      const testEndpoints = [
        mainBaseUrl,
        `${mainBaseUrl}/news`,
        'http://localhost:8000',
        'http://localhost:8000/api/v1',
        'http://localhost:8000/health',
        'http://localhost:8000/api/v1/health'
      ];
      
      for (const endpoint of testEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(endpoint, { 
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log(`Backend connection test result for ${endpoint}:`, response.status);
          if (response.ok) {
            return true;
          }
        } catch (error) {
          console.log(`Backend connection test failed for ${endpoint}:`, error);
        }
      }
      
      return false;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }


  // Post user chatbot article using post_user_chatbot_article API
  async postUserChatbotArticle(data: UserChatbotArticleRequest): Promise<UserChatbotArticleResponse> {
    try {
      console.log('Posting user chatbot article via post_user_chatbot_article API:', data);
      
      // Validate file if provided
      if (data.file) {
        const validation = this.validateFile(data.file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        console.log('File validation passed:', data.file.name, data.file.type, `${(data.file.size / 1024 / 1024).toFixed(2)}MB`);
      }
      
      // Determine article type
      const articleType = this.determineArticleType(data.file);
      console.log('Article type determined:', articleType);
      
      // Test backend connectivity first
      const isBackendReachable = await this.testBackendConnection();
      if (!isBackendReachable) {
        throw new Error('Backend server is not reachable. Please ensure your backend server is running on port 8000.');
      }

      // Choose endpoint based on whether we have a media file
      let endpoint;
      if (data.file) {
        // Use upload_chatbot_media for articles with media files
        endpoint = '/news/upload_chatbot_media';
        console.log('Using upload_chatbot_media endpoint for media file upload');
      } else {
        // Use post_user_chatbot_article for text-only articles
        endpoint = '/news/post_user_chatbot_article';
        console.log('Using post_user_chatbot_article endpoint for text-only article');
      }

      // Create FormData for the appropriate API
      const formData = new FormData();
      
      // Required fields
      formData.append('full_name', data.full_name);
      formData.append('news_desc', data.news_desc);
      
      // Email is now mandatory
      formData.append('email_id', data.email_id);
      
      // Optional fields with default values
      formData.append('contact_number', data.contact_number || 'Not provided');
      formData.append('address', data.address || 'Not provided');
      
      // Set article_type based on file attachment: text if no file, audio/video if file attached
      // Ensure article_type is never null or undefined
      const finalArticleType = articleType || 'text';
      formData.append('article_type', finalArticleType);
      console.log('Article type being sent:', finalArticleType);
      console.log('Original articleType value:', articleType);
      
      if (data.file) {
        if (endpoint === '/news/upload_chatbot_media') {
          // For upload_chatbot_media endpoint, use 'media_file' field name
          formData.append('media_file', data.file);
          console.log('Media file attached to upload_chatbot_media:', data.file.name, 'Type:', data.file.type, 'Size:', `${(data.file.size / 1024 / 1024).toFixed(2)}MB`);
        } else {
          // For post_user_chatbot_article endpoint, use 'file' field name
          formData.append('file', data.file);
          console.log('File attached to post_user_chatbot_article:', data.file.name, 'Type:', data.file.type, 'Size:', `${(data.file.size / 1024 / 1024).toFixed(2)}MB`);
        }
      } else {
        console.log('No file attachment - using text-only endpoint');
      }

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Validate that all required fields are present
      const requiredFields = ['full_name', 'email_id', 'news_desc', 'article_type'];
      const missingFields = requiredFields.filter(field => {
        const value = formData.get(field);
        return !value || value === 'null' || value === 'undefined';
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Using chatbot endpoint:', endpoint);
      
      // Create a custom axios instance for file uploads to avoid Content-Type conflicts
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const uploadClient = axios.create({
        baseURL,
        timeout: 120000,
        headers: {
          // Don't set Content-Type here - let axios set it automatically for FormData
        },
      });

      // Add auth token if available
      const token = localStorage.getItem('access_token');
      if (token) {
        uploadClient.defaults.headers.Authorization = `Bearer ${token}`;
      }

      console.log('Full URL being called:', `${baseURL}${endpoint}`);
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await uploadClient.post<UserChatbotArticleResponse>(
        endpoint,
        formData
      );
      
      console.log('Media uploaded successfully via chatbot API:');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response formats from backend
      const responseData = response.data;
      
      // If response doesn't have success field, assume it's successful if we got here
      if (responseData && typeof responseData === 'object') {
        // Ensure success field is set to true
        if (responseData.success === undefined) {
          responseData.success = true;
        }
        // Add default message if not present
        if (!responseData.message) {
          responseData.message = 'Article submitted successfully';
        }
      }
      
      return responseData;
      
    } catch (error: any) {
      console.error('Error posting user chatbot article:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        response: error.response?.data,
        config: error.config,
        url: error.config?.url,
        method: error.config?.method,
        fullURL: error.config?.baseURL + error.config?.url
      });
      
      // Check if this might be a successful database insertion with unexpected response format
      if (error.response?.status === 200 || error.response?.status === 201) {
        console.log('Received 200/201 status - treating as success despite error format');
        return {
          success: true,
          message: 'Article submitted successfully',
          data: error.response?.data
        };
      }
      
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error('Chatbot API endpoint not found. Please check if the backend server is running and the endpoint is correct.');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        throw new Error('Network error - unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
      } else if (error.response?.status >= 500) {
        const serverMessage = error.response?.data?.message || error.response?.data?.detail || 'Unknown server error';
        throw new Error(`Server error (${error.response.status}): ${serverMessage}`);
      } else if (error.response?.status === 400) {
        const validationMessage = error.response?.data?.message || error.response?.data?.detail || 'Invalid request data';
        throw new Error(`Validation error: ${validationMessage}`);
      } else if (error.response?.data?.message) {
        throw new Error(`API Error: ${error.response.data.message}`);
      } else if (error.response?.data?.detail) {
        throw new Error(`API Error: ${error.response.data.detail}`);
      } else {
        throw new Error(error.message || 'An unexpected error occurred while submitting your article.');
      }
    }
  }
}

// Create service instance
export const userChatbotApiService = new UserChatbotApiService();

// Cached version (optional - for future caching needs)
export const cachedUserChatbotApi = {
  postUserChatbotArticle: userChatbotApiService.postUserChatbotArticle.bind(userChatbotApiService),
};
