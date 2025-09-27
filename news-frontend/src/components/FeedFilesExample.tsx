import React, { useState, useEffect } from 'react';
// Removed unused Link import
import { fetchFeedFiles, fetchNationalLatestNews, fetchWorldLatestNews } from '../services/newsApi';
import type { FeedFilesResponse, TrendingNewsResponse } from '../types/api';
import LoadingSpinner from './LoadingSpinner';

const FeedFilesExample: React.FC = () => {
  const [feedData, setFeedData] = useState<FeedFilesResponse | null>(null);
  const [nationalNews, setNationalNews] = useState<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  } | null>(null);
  const [worldNews, setWorldNews] = useState<{
    politics: TrendingNewsResponse[];
    education: TrendingNewsResponse[];
    business: TrendingNewsResponse[];
    local: TrendingNewsResponse[];
    sports: TrendingNewsResponse[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all feed files data
        const [feedFilesData, nationalData, worldData] = await Promise.all([
          fetchFeedFiles(),
          fetchNationalLatestNews(5),
          fetchWorldLatestNews(5)
        ]);
        
        setFeedData(feedFilesData);
        setNationalNews(nationalData);
        setWorldNews(worldData);
      } catch (err) {
        console.error('Error loading feed files:', err);
        setError('Failed to load feed files data');
      } finally {
        setLoading(false);
      }
    };

    loadFeedFiles();
  }, []);

  const renderNewsSection = (
    title: string,
    news: TrendingNewsResponse[]
  ) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">
        {title}
      </h3>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.author}</span>
                  <span>{item.published_at ? new Date(item.published_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                {item.read_more_url && (
                  <a
                    href={item.read_more_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} news available</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed Files API Demo</h1>
        <p className="text-gray-600">
          This demonstrates the new fetch_feed_files API with category-specific news, 
          proper source classification (national/world), and duplicate prevention.
        </p>
        {feedData && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Total Articles:</strong> {feedData.total_articles} | 
              <strong> Last Updated:</strong> {new Date(feedData.last_updated).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* National News Sections */}
      {nationalNews && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-green-500 pb-2">
            National Latest News
          </h2>
          {renderNewsSection('Politics', nationalNews.politics)}
          {renderNewsSection('Education', nationalNews.education)}
          {renderNewsSection('Business', nationalNews.business)}
          {renderNewsSection('Local', nationalNews.local)}
          {renderNewsSection('Sports', nationalNews.sports)}
        </div>
      )}

      {/* World News Sections */}
      {worldNews && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-purple-500 pb-2">
            World Latest News
          </h2>
          {renderNewsSection('Politics', worldNews.politics)}
          {renderNewsSection('Education', worldNews.education)}
          {renderNewsSection('Business', worldNews.business)}
          {renderNewsSection('Local', worldNews.local)}
          {renderNewsSection('Sports', worldNews.sports)}
        </div>
      )}

      {/* Feed Files Data Summary */}
      {feedData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed Files Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">National Latest</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Politics: {feedData.national_latest.politics.length} articles</li>
                <li>Education: {feedData.national_latest.education.length} articles</li>
                <li>Business: {feedData.national_latest.business.length} articles</li>
                <li>Local: {feedData.national_latest.local.length} articles</li>
                <li>Sports: {feedData.national_latest.sports.length} articles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">World Latest</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Politics: {feedData.world_latest.politics.length} articles</li>
                <li>Education: {feedData.world_latest.education.length} articles</li>
                <li>Business: {feedData.world_latest.business.length} articles</li>
                <li>Local: {feedData.world_latest.local.length} articles</li>
                <li>Sports: {feedData.world_latest.sports.length} articles</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedFilesExample;
