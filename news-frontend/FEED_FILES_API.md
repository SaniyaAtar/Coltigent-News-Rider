# Feed Files API Documentation

## Overview

The Feed Files API provides a comprehensive solution for fetching news articles across different categories (politics, education, business, local, sports) with proper source classification and duplicate prevention.

## Key Features

### 1. Category-Specific News Fetching
- **Politics**: Government, elections, parliament, political news
- **Education**: Schools, universities, colleges, student-related news
- **Business**: Economy, finance, markets, corporate news
- **Local**: Regional, city, municipal news
- **Sports**: Cricket, football, hockey, tennis, athletics, Olympics

### 2. Source Classification
- **National**: India-related news (automatically detected based on content)
- **World**: International/global news

### 3. Duplicate Prevention
- Automatic exclusion of duplicate articles across different categories
- ID-based filtering to prevent same news from appearing multiple times

## API Endpoints

### Main Feed Files API

```typescript
// Fetch all feed files data
const feedData = await fetchFeedFiles();
```

**Response Structure:**
```typescript
interface FeedFilesResponse {
  national_latest: {
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  };
  world_latest: {
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  };
  total_articles: number;
  last_updated: string;
}
```

### Category-Specific APIs

```typescript
// Get national latest news for all categories
const nationalNews = await fetchNationalLatestNews(limit: number = 5);

// Get world latest news for all categories
const worldNews = await fetchWorldLatestNews(limit: number = 5);

// Get latest news for specific category and source
const politicsNews = await fetchLatestNewsByCategory('politics', 'national', 10);

// Fetch news by category with custom request
const customNews = await fetchNewsByCategory({
  category: 'business',
  source: 'world',
  limit: 15,
  exclude_ids: [1, 2, 3] // Exclude specific article IDs
});
```

## Usage Examples

### Basic Usage

```typescript
import { fetchFeedFiles, fetchNationalLatestNews } from '../services/newsApi';

// Fetch all feed files
const loadAllFeedFiles = async () => {
  try {
    const feedData = await fetchFeedFiles();
    console.log('Total articles:', feedData.total_articles);
    console.log('National politics news:', feedData.national_latest.politics);
    console.log('World business news:', feedData.world_latest.business);
  } catch (error) {
    console.error('Error loading feed files:', error);
  }
};

// Fetch only national news
const loadNationalNews = async () => {
  try {
    const nationalNews = await fetchNationalLatestNews(10);
    console.log('National politics:', nationalNews.politics);
    console.log('National sports:', nationalNews.sports);
  } catch (error) {
    console.error('Error loading national news:', error);
  }
};
```

### React Component Usage

```typescript
import React, { useState, useEffect } from 'react';
import { fetchFeedFiles } from '../services/newsApi';

const NewsFeed: React.FC = () => {
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedFiles = async () => {
      try {
        const data = await fetchFeedFiles();
        setFeedData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedFiles();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>National Politics ({feedData.national_latest.politics.length})</h2>
      {feedData.national_latest.politics.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <span>Source: {article.source}</span>
          <span>Category: {article.category}</span>
        </div>
      ))}
    </div>
  );
};
```

## Source Classification Logic

The API automatically determines whether news is "national" (India-related) or "world" based on:

1. **Content Analysis**: Checks for India-related keywords in title, content, and source
2. **Geographic Keywords**: Includes major Indian cities, states, and regions
3. **Fallback Logic**: If no India-related keywords found, classifies as "world"

### India-Related Keywords Include:
- Major cities: Delhi, Mumbai, Bangalore, Chennai, Kolkata, etc.
- States: Maharashtra, Tamil Nadu, Karnataka, West Bengal, etc.
- Government terms: Parliament, Lok Sabha, Rajya Sabha, etc.
- And many more...

## Category Mapping

The API maps various category types to standardized categories:

| Input Category | Mapped Category |
|----------------|-----------------|
| politics, political, government, election, parliament | politics |
| education, educational, school, university, college, student | education |
| business, economy, economic, finance, financial, market, corporate | business |
| local, regional, city, municipal | local |
| sports, sport, cricket, football, hockey, tennis, badminton, athletics, olympics | sports |

## Caching

All API methods are cached for optimal performance:

- **Feed Files**: 2 minutes cache
- **Category-specific news**: 1-2 minutes cache
- **National/World news**: 2 minutes cache

## Error Handling

The API includes comprehensive error handling:

- Graceful fallback to alternative endpoints
- Individual category failures don't affect other categories
- Detailed error logging for debugging
- Fallback data structures to prevent crashes

## Backend Integration

The API integrates with existing backend endpoints:

- Primary: `/api/news/get_db_s3_trending_news`
- Alternative: `/news/get_db_s3_trending_news`
- Fallback: `/api/news/get_db_s3_breaking_news`

## Performance Considerations

- **Parallel Fetching**: Multiple categories fetched simultaneously
- **Duplicate Prevention**: Efficient ID-based filtering
- **Caching**: Reduces API calls and improves response times
- **Error Resilience**: Continues operation even if some categories fail

## Migration from Old API

If you were using a previous `fetch_feed_files` function, you can now use:

```typescript
// Old way (if it existed)
// const data = await fetch_feed_files();

// New way
const data = await fetchFeedFiles();
```

The new API provides the same functionality with enhanced features and better error handling.
