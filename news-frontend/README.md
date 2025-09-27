# News Frontend - Production Ready React Application

A modern, production-ready React frontend application for a news platform with comprehensive API integration, authentication, caching, and error handling.

## 🚀 Features

- **Modern React Architecture**: Built with React 19, TypeScript, and Vite
- **Production-Ready API Integration**: Comprehensive API service with error handling, caching, and retry logic
- **Authentication System**: Complete user authentication with JWT tokens, registration, and password management
- **Error Handling**: Global error boundary, API error handling, and user-friendly error messages
- **Performance Optimization**: Code splitting, lazy loading, caching, and optimized builds
- **Responsive Design**: Bootstrap-based responsive UI with modern styling
- **Type Safety**: Full TypeScript integration with comprehensive type definitions
- **Development Tools**: ESLint, Prettier, and development server with hot reload

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- News Backend API running (see backend setup)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your configuration
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=News Frontend
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                    # Legacy API files (deprecated)
├── assets/                 # Static assets
├── components/             # Reusable UI components
│   ├── BreakingNews.tsx   # Breaking news component
│   ├── ErrorBoundary.tsx  # Error boundary component
│   ├── ErrorMessage.tsx   # Error message component
│   ├── LoadingSpinner.tsx # Loading spinner component
│   ├── LoginForm.tsx      # Login form component
│   ├── NewsDetailPage.tsx # News detail page component
│   ├── NewsFeed.tsx       # News feed component
│   ├── RegisterForm.tsx   # Registration form component
│   └── TrendingNews.tsx   # Trending news component
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                  # Custom React hooks
│   ├── useApi.ts          # Generic API hook
│   ├── useAuth.ts         # Authentication hook
│   └── useNews.ts         # News-specific hooks
├── pages/                  # Page components
│   ├── Home.tsx           # Home page
│   └── Login.tsx          # Login/Register page
├── services/               # API services
│   ├── apiClient.ts       # Axios client configuration
│   ├── authApi.ts         # Authentication API service
│   ├── cache.ts           # Caching service
│   └── newsApi.ts         # News API service
├── types/                  # TypeScript type definitions
│   └── api.ts             # API types and interfaces
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Application name | `News Frontend` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_NODE_ENV` | Environment mode | `development` |

### API Configuration

The application uses a centralized API client with the following features:

- **Automatic token management**: JWT tokens are automatically attached to requests
- **Token refresh**: Automatic token refresh on expiration
- **Request/Response interceptors**: Logging and error handling
- **Timeout handling**: 30-second request timeout
- **Error standardization**: Consistent error format across the application

### Caching Strategy

The application implements intelligent caching:

- **In-memory cache**: Fast access to frequently requested data
- **TTL-based expiration**: Different cache durations for different data types
- **Cache invalidation**: Automatic cache cleanup on expiration
- **Selective caching**: Only cache appropriate data (breaking news, categories, etc.)

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Production
npm run build:prod   # Build with production optimizations
```

## 🏭 Production Deployment

### Build Configuration

The production build includes:

- **Code splitting**: Automatic vendor and feature chunking
- **Tree shaking**: Removal of unused code
- **Minification**: Terser-based minification
- **Asset optimization**: Optimized images and assets
- **Source map removal**: No source maps in production
- **Console removal**: Debug logs removed from production

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure production environment**
   ```bash
   # Update .env.production with production API URL
   VITE_API_BASE_URL=https://your-production-api.com/api/v1
   ```

3. **Deploy to your hosting platform**
   - Upload the `dist` folder contents
   - Configure your web server for SPA routing
   - Set up HTTPS and security headers

### Recommended Hosting Platforms

- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: Easy deployment with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for public repositories

## 🔐 Authentication

The application includes a complete authentication system:

### Features

- **User Registration**: Email validation and password strength requirements
- **User Login**: Username/email and password authentication
- **JWT Token Management**: Automatic token storage and refresh
- **Password Management**: Change password and reset password functionality
- **Email Verification**: Email verification for new accounts
- **Protected Routes**: Route protection based on authentication status

### Usage

```typescript
import { useAuthContext } from './contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuthContext();
  
  // Use authentication state and methods
};
```

## 📊 API Integration

### News API

```typescript
import { newsApiService } from './services/newsApi';

// Get breaking news
const breakingNews = await newsApiService.getBreakingNews(5);

// Get news by category
const sportsNews = await newsApiService.getNewsByCategory('sports', 10);

// Search news
const searchResults = await newsApiService.searchNews('technology', 10);
```

### Custom Hooks

```typescript
import { useBreakingNews, useLatestNews } from './hooks/useNews';

const MyComponent = () => {
  const { data: breakingNews, loading, error } = useBreakingNews(5);
  const { data: latestNews } = useLatestNews(10);
  
  // Use the data
};
```

## 🎨 Styling

The application uses Bootstrap 5 with custom CSS:

- **Responsive Design**: Mobile-first responsive layout
- **Custom Components**: Styled news cards, buttons, and forms
- **Loading States**: Consistent loading spinners and skeletons
- **Error States**: User-friendly error messages and alerts
- **Dark Mode Ready**: CSS variables for easy theme switching

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (when implemented)
npm run test:e2e
```

## 📈 Performance

### Optimizations

- **Code Splitting**: Automatic vendor and feature chunking
- **Lazy Loading**: Images and components loaded on demand
- **Caching**: Intelligent API response caching
- **Bundle Analysis**: Optimized bundle sizes
- **Tree Shaking**: Unused code elimination

### Performance Monitoring

- **Bundle Size**: Monitor bundle size with `npm run build`
- **Lighthouse**: Use Lighthouse for performance auditing
- **Core Web Vitals**: Monitor LCP, FID, and CLS metrics

## 🔧 Development

### Code Style

- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (configure as needed)
- **TypeScript**: Strict type checking enabled

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create pull request
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend API is running
   - Verify `VITE_API_BASE_URL` in environment variables
   - Check CORS configuration on backend

2. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`
   - Verify environment variables

3. **Authentication Issues**
   - Check token storage in browser dev tools
   - Verify JWT token format and expiration
   - Check backend authentication endpoints

### Debug Mode

Enable debug mode by setting:
```bash
VITE_DEBUG=true
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using React, TypeScript, and modern web technologies**