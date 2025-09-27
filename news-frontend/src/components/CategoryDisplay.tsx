import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cachedTrendingApi } from "../services/trendingApi";
import { apiClient } from "../services/apiClient";
import { getCategoryType, getCategoryDisplayName } from "../utils/categoryMapping";
import type { TrendingNewsResponse } from "../types/api";
import "./CategoryDisplay.css";

interface CategoryDisplayProps {
  category?: string;
  layout?: 'grid' | 'list' | 'carousel' | 'featured';
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  showViewMore?: boolean;
  apiMethod?: 'default' | 'trending' | 'excluding_trending';
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ 
  category = 'trending',
  layout = 'grid', 
  limit = 12, 
  showHeader = true,
  showFilters = false,
  showViewMore = true,
  apiMethod = 'default'
}) => {
  const [newsData, setNewsData] = useState<TrendingNewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<TrendingNewsResponse[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest');
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  // Get category type and display name
  const categoryType = getCategoryType(category);
  const baseDisplayName = getCategoryDisplayName(categoryType || category);
  const displayName = baseDisplayName === 'Trending' ? 'Trending Headlines' : `${baseDisplayName} News Headlines`;
  
  // Get category-specific styling
  const getCategoryStyle = (cat: string) => {
    const styles: { [key: string]: { color: string; icon: string; bg: string } } = {
      national: { color: '#dc3545', icon: 'bi-flag', bg: 'bg-danger' },
      world: { color: '#0d6efd', icon: 'bi-globe', bg: 'bg-primary' },
      sports: { color: '#198754', icon: 'bi-trophy', bg: 'bg-success' },
      business: { color: '#fd7e14', icon: 'bi-briefcase', bg: 'bg-warning' },
      education: { color: '#6f42c1', icon: 'bi-book', bg: 'bg-purple' },
      local: { color: '#20c997', icon: 'bi-geo-alt', bg: 'bg-info' },
      health: { color: '#e83e8c', icon: 'bi-heart', bg: 'bg-pink' },
      technology: { color: '#6c757d', icon: 'bi-laptop', bg: 'bg-secondary' },
      entertainment: { color: '#fd7e14', icon: 'bi-music-note', bg: 'bg-warning' },
      politics: { color: '#dc3545', icon: 'bi-building', bg: 'bg-danger' },
      science: { color: '#0dcaf0', icon: 'bi-atom', bg: 'bg-info' },
      environment: { color: '#198754', icon: 'bi-tree', bg: 'bg-success' },
      trending: { color: '#1e40af', icon: 'bi-fire', bg: 'bg-primary' },
      default: { color: '#1e40af', icon: 'bi-newspaper', bg: 'bg-primary' }
    };
    return styles[cat.toLowerCase()] || styles.default;
  };
  
  const categoryStyle = getCategoryStyle(category);

  // Fetch news data
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: TrendingNewsResponse[] = [];
        
        // Fetch data based on category
        const normalizedCategory = category.toLowerCase();
        
        if (normalizedCategory === 'national') {
          if (apiMethod === 'excluding_trending') {
            // Use national news excluding trending category for featured stories
            data = await cachedTrendingApi.getNationalNewsExcludingTrending(limit * 2);
            console.log(`CategoryDisplay: Using national news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use trending national news API with source=national and category=trending
            data = await cachedTrendingApi.getLatestTrendingNationalNews(limit * 2);
            // Additional client-side filtering to ensure only national trending news
            data = data.filter(article => {
              const source = article.source?.toLowerCase();
              const category = article.category?.toLowerCase();
              const isNational = source === 'national';
              const isTrending = category === 'trending';
              if (!isNational || !isTrending) {
                console.log(`CategoryDisplay: Filtering out non-national-trending article: "${article.title}" - source: ${source}, category: ${category}`);
              }
              return isNational && isTrending;
            });
          } else {
            // Default behavior - use trending national news
            data = await cachedTrendingApi.getLatestTrendingNationalNews(limit * 2);
            // Additional client-side filtering to ensure only national trending news
            data = data.filter(article => {
              const source = article.source?.toLowerCase();
              const category = article.category?.toLowerCase();
              const isNational = source === 'national';
              const isTrending = category === 'trending';
              if (!isNational || !isTrending) {
                console.log(`CategoryDisplay: Filtering out non-national-trending article: "${article.title}" - source: ${source}, category: ${category}`);
              }
              return isNational && isTrending;
            });
          }
        } else if (normalizedCategory === 'world') {
          if (apiMethod === 'excluding_trending') {
            // Use world news excluding trending category for featured stories
            data = await cachedTrendingApi.getWorldNewsExcludingTrending(limit * 2);
            console.log(`CategoryDisplay: Using world news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use world trending news API with source=world and category=trending
            data = await cachedTrendingApi.getLatestTrendingWorldNews(limit * 2);
            // Additional client-side filtering to ensure only world trending news
            data = data.filter(article => {
              const source = article.source?.toLowerCase();
              const category = article.category?.toLowerCase();
              const isWorld = source === 'world';
              const isTrending = category === 'trending';
              if (!isWorld || !isTrending) {
                console.log(`CategoryDisplay: Filtering out non-world-trending article: "${article.title}" - source: ${source}, category: ${category}`);
              }
              return isWorld && isTrending;
            });
          } else {
            // Default behavior - use all world news
            data = await cachedTrendingApi.getWorldTrendingNews(limit * 2);
            // Client-side filtering to ensure only world news
            data = data.filter(article => {
              const source = article.source?.toLowerCase();
              const isWorld = source === 'world';
              if (!isWorld) {
                console.log(`CategoryDisplay: Filtering out non-world article: "${article.title}" - source: ${source}`);
              }
              return isWorld;
            });
          }
        } else if (normalizedCategory === 'sports') {
          console.log(`CategoryDisplay: Processing sports category with apiMethod: ${apiMethod}`);
          console.log(`CategoryDisplay: API Client base URL:`, apiClient.defaults.baseURL);
          console.log(`CategoryDisplay: API Client timeout:`, apiClient.defaults.timeout);
          
          if (apiMethod === 'excluding_trending') {
            // Use sports news excluding trending category for featured stories
            data = await cachedTrendingApi.getSportsNewsExcludingTrending(limit * 2);
            console.log(`CategoryDisplay: Using sports news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use sports trending news API with category_type=sport and category=trending
            data = await cachedTrendingApi.getLatestTrendingSportsNews(limit * 2);
            // Additional client-side filtering to ensure only sports trending news
            data = data.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              const isSport = categoryType === 'sport';
              const isTrending = category === 'trending';
              if (!isSport || !isTrending) {
                console.log(`CategoryDisplay: Filtering out non-sports-trending article: "${article.title}" - category_type: ${categoryType}, category: ${category}`);
              }
              return isSport && isTrending;
            });
          } else {
            // Default behavior - use sports trending news (same pattern as national)
            try {
              console.log(`CategoryDisplay: Attempting to fetch sports trending news...`);
              data = await cachedTrendingApi.getLatestTrendingSportsNews(limit * 2);
              console.log(`CategoryDisplay: Received ${data.length} sports trending articles from API`);
              
              // If no data from API, try fallback
              if (data.length === 0) {
                console.log(`CategoryDisplay: No sports data from API, trying fallback...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for fallback`);
                
                data = allTrendingData.filter(item => {
                  const source = item.source?.toLowerCase();
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';
                  
                  // Check if it's sports-related by multiple criteria
                  const isSportsByCategory = category === 'sports' || category === 'sport';
                  const isSportsByCategoryType = categoryType === 'sport';
                  const isSportsByContent = title.includes('sport') || 
                                          title.includes('football') || 
                                          title.includes('cricket') || 
                                          title.includes('basketball') || 
                                          title.includes('tennis') || 
                                          title.includes('soccer') ||
                                          title.includes('game') ||
                                          title.includes('match') ||
                                          description.includes('sport') ||
                                          description.includes('football') ||
                                          description.includes('cricket');
                  
                  const isSports = isSportsByCategory || isSportsByCategoryType || isSportsByContent;
                  
                  if (isSports) {
                    console.log(`CategoryDisplay: Found sports article in fallback: "${item.title}" - source: ${source}, category: ${category}, category_type: ${categoryType}`);
                  }
                  
                  return isSports;
                });
                console.log(`CategoryDisplay: Fallback found ${data.length} sports articles`);
              }
            } catch (sportsError) {
              console.error('Sports trending API failed completely:', sportsError);
              // Final fallback - try general trending news
              try {
                console.log(`CategoryDisplay: Trying final fallback with general trending news...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for final fallback`);
                
                data = allTrendingData.filter(item => {
                  const source = item.source?.toLowerCase();
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';
                  
                  // Check if it's sports-related by multiple criteria
                  const isSportsByCategory = category === 'sports' || category === 'sport';
                  const isSportsByCategoryType = categoryType === 'sport';
                  const isSportsByContent = title.includes('sport') || 
                                          title.includes('football') || 
                                          title.includes('cricket') || 
                                          title.includes('basketball') || 
                                          title.includes('tennis') || 
                                          title.includes('soccer') ||
                                          title.includes('game') ||
                                          title.includes('match') ||
                                          description.includes('sport') ||
                                          description.includes('football') ||
                                          description.includes('cricket');
                  
                  const isSports = isSportsByCategory || isSportsByCategoryType || isSportsByContent;
                  
                  if (isSports) {
                    console.log(`CategoryDisplay: Found sports article in final fallback: "${item.title}" - source: ${source}, category: ${category}, category_type: ${categoryType}`);
                  }
                  
                  return isSports;
                });
                console.log(`CategoryDisplay: Final fallback found ${data.length} sports articles`);
              } catch (finalError) {
                console.error('Final fallback also failed:', finalError);
                data = [];
              }
            }
            
            // Additional client-side filtering to ensure only sports trending news
            if (data.length > 0) {
              const originalLength = data.length;
              data = data.filter(article => {
                const categoryType = article.category_type?.toLowerCase();
                const category = article.category?.toLowerCase();
                const source = article.source?.toLowerCase();
                const title = article.title?.toLowerCase() || '';
                const description = article.description?.toLowerCase() || '';
                
                // More flexible filtering - accept sports content even if not perfectly categorized
                const isSport = categoryType === 'sport' || 
                               category === 'sport' || 
                               category === 'sports' || 
                               title.includes('sport') ||
                               title.includes('football') ||
                               title.includes('cricket') ||
                               title.includes('basketball') ||
                               title.includes('tennis') ||
                               title.includes('soccer') ||
                               description.includes('sport');
                
                const isTrending = category === 'trending' || category === 'sports' || category === 'sport';
                
                if (!isSport || !isTrending) {
                  console.log(`CategoryDisplay: Filtering out article: "${article.title}" - category_type: ${categoryType}, category: ${category}, source: ${source}`);
                }
                return isSport && isTrending;
              });
              console.log(`CategoryDisplay: Filtered from ${originalLength} to ${data.length} sports articles`);
            }
          }
        } else if (normalizedCategory === 'business') {
          console.log(`CategoryDisplay: Processing business category with apiMethod: ${apiMethod}`);
          console.log(`CategoryDisplay: API Client base URL:`, apiClient.defaults.baseURL);
          console.log(`CategoryDisplay: API Client timeout:`, apiClient.defaults.timeout);
          
          if (apiMethod === 'excluding_trending') {
            // Use business news excluding trending category for featured stories
            data = await cachedTrendingApi.getTrendingNewsByCategory('business', 1, limit * 2);
            console.log(`CategoryDisplay: Using business news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use business trending news API with category_type=business and category=trending
            data = await cachedTrendingApi.getLatestTrendingBusinessNews(limit * 2);
            console.log(`CategoryDisplay: Using business trending news API`);
          } else {
            // Default behavior - use business trending news (same pattern as sports)
            try {
              console.log(`CategoryDisplay: Attempting to fetch business trending news...`);
              data = await cachedTrendingApi.getLatestTrendingBusinessNews(limit * 2);
              console.log(`CategoryDisplay: Received ${data.length} business trending articles from API`);

              // If no data from API, try fallback
              if (data.length === 0) {
                console.log(`CategoryDisplay: No business data from API, trying fallback...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for fallback`);

                data = allTrendingData.filter(item => {
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';

                  // Check if it's business-related by multiple criteria
                  const isBusinessByCategory = category === 'business';
                  const isBusinessByCategoryType = categoryType === 'business';
                  const isBusinessByContent = title.includes('business') ||
                                            title.includes('economy') ||
                                            title.includes('finance') ||
                                            title.includes('market') ||
                                            title.includes('stock') ||
                                            title.includes('investment') ||
                                            title.includes('company') ||
                                            title.includes('corporate') ||
                                            title.includes('banking') ||
                                            title.includes('trading') ||
                                            description.includes('business') ||
                                            description.includes('economy') ||
                                            description.includes('finance');

                  const isBusiness = isBusinessByCategory || isBusinessByCategoryType || isBusinessByContent;

                  if (isBusiness) {
                    console.log(`CategoryDisplay: Found business article in fallback: "${item.title}" - category: ${category}, category_type: ${categoryType}`);
                  }

                  return isBusiness;
                });
                console.log(`CategoryDisplay: Fallback found ${data.length} business articles`);
              }
            } catch (businessError) {
              console.error('Business trending API failed completely:', businessError);
              // Final fallback - try general trending news
              try {
                console.log(`CategoryDisplay: Trying final fallback with general trending news...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for final fallback`);

                data = allTrendingData.filter(item => {
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';

                  // Check if it's business-related by multiple criteria
                  const isBusinessByCategory = category === 'business';
                  const isBusinessByCategoryType = categoryType === 'business';
                  const isBusinessByContent = title.includes('business') ||
                                            title.includes('economy') ||
                                            title.includes('finance') ||
                                            title.includes('market') ||
                                            title.includes('stock') ||
                                            title.includes('investment') ||
                                            title.includes('company') ||
                                            title.includes('corporate') ||
                                            title.includes('banking') ||
                                            title.includes('trading') ||
                                            description.includes('business') ||
                                            description.includes('economy') ||
                                            description.includes('finance');

                  const isBusiness = isBusinessByCategory || isBusinessByCategoryType || isBusinessByContent;

                  if (isBusiness) {
                    console.log(`CategoryDisplay: Found business article in final fallback: "${item.title}" - category: ${category}, category_type: ${categoryType}`);
                  }

                  return isBusiness;
                });
                console.log(`CategoryDisplay: Final fallback found ${data.length} business articles`);
              } catch (finalError) {
                console.error('Final fallback also failed:', finalError);
                data = [];
              }
            }

            // Additional client-side filtering to ensure only business trending news
            if (data.length > 0) {
              const originalLength = data.length;
              data = data.filter(article => {
                const categoryType = article.category_type?.toLowerCase();
                const category = article.category?.toLowerCase();
                const title = article.title?.toLowerCase() || '';
                const description = article.description?.toLowerCase() || '';

                // More flexible filtering - accept business content even if not perfectly categorized
                const isBusiness = categoryType === 'business' ||
                                 category === 'business' ||
                                 title.includes('business') ||
                                 title.includes('economy') ||
                                 title.includes('finance') ||
                                 title.includes('market') ||
                                 title.includes('stock') ||
                                 title.includes('investment') ||
                                 title.includes('company') ||
                                 title.includes('corporate') ||
                                 description.includes('business');

                const isTrending = category === 'trending' || category === 'business';

                if (!isBusiness || !isTrending) {
                  console.log(`CategoryDisplay: Filtering out article: "${article.title}" - category_type: ${categoryType}, category: ${category}`);
                }
                return isBusiness && isTrending;
              });
              console.log(`CategoryDisplay: Filtered from ${originalLength} to ${data.length} business articles`);
            }
          }
        } else if (normalizedCategory === 'education') {
          console.log(`CategoryDisplay: Processing education category with apiMethod: ${apiMethod}`);
          console.log(`CategoryDisplay: API Client base URL:`, apiClient.defaults.baseURL);
          console.log(`CategoryDisplay: API Client timeout:`, apiClient.defaults.timeout);
          
          if (apiMethod === 'excluding_trending') {
            // Use education news excluding trending category for featured stories
            data = await cachedTrendingApi.getEducationNewsExcludingTrending(limit * 2);
            console.log(`CategoryDisplay: Using education news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use education trending news API with category_type=education and category=trending
            data = await cachedTrendingApi.getLatestTrendingEducationNews(limit * 2);
            console.log(`CategoryDisplay: Using education trending news API`);
          } else {
            // Default behavior - use education trending news (same pattern as sports and business)
            try {
              console.log(`CategoryDisplay: Attempting to fetch education trending news...`);
              data = await cachedTrendingApi.getLatestTrendingEducationNews(limit * 2);
              console.log(`CategoryDisplay: Received ${data.length} education trending articles from API`);

              // If no data from API, try fallback
              if (data.length === 0) {
                console.log(`CategoryDisplay: No education data from API, trying fallback...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for fallback`);

                data = allTrendingData.filter(item => {
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';

                  // Check if it's education-related by multiple criteria
                  const isEducationByCategory = category === 'education';
                  const isEducationByCategoryType = categoryType === 'education';
                  const isEducationByContent = title.includes('education') ||
                                            title.includes('school') ||
                                            title.includes('university') ||
                                            title.includes('college') ||
                                            title.includes('student') ||
                                            title.includes('teacher') ||
                                            title.includes('learning') ||
                                            title.includes('academic') ||
                                            title.includes('study') ||
                                            title.includes('research') ||
                                            title.includes('scholarship') ||
                                            title.includes('curriculum') ||
                                            description.includes('education') ||
                                            description.includes('school') ||
                                            description.includes('university') ||
                                            description.includes('learning');

                  const isEducation = isEducationByCategory || isEducationByCategoryType || isEducationByContent;

                  if (isEducation) {
                    console.log(`CategoryDisplay: Found education article in fallback: "${item.title}" - category: ${category}, category_type: ${categoryType}`);
                  }

                  return isEducation;
                });
                console.log(`CategoryDisplay: Fallback found ${data.length} education articles`);
              }
            } catch (educationError) {
              console.error('Education trending API failed completely:', educationError);
              // Final fallback - try general trending news
              try {
                console.log(`CategoryDisplay: Trying final fallback with general trending news...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for final fallback`);

                data = allTrendingData.filter(item => {
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';

                  // Check if it's education-related by multiple criteria
                  const isEducationByCategory = category === 'education';
                  const isEducationByCategoryType = categoryType === 'education';
                  const isEducationByContent = title.includes('education') ||
                                            title.includes('school') ||
                                            title.includes('university') ||
                                            title.includes('college') ||
                                            title.includes('student') ||
                                            title.includes('teacher') ||
                                            title.includes('learning') ||
                                            title.includes('academic') ||
                                            title.includes('study') ||
                                            title.includes('research') ||
                                            title.includes('scholarship') ||
                                            title.includes('curriculum') ||
                                            description.includes('education') ||
                                            description.includes('school') ||
                                            description.includes('university') ||
                                            description.includes('learning');

                  const isEducation = isEducationByCategory || isEducationByCategoryType || isEducationByContent;

                  if (isEducation) {
                    console.log(`CategoryDisplay: Found education article in final fallback: "${item.title}" - category: ${category}, category_type: ${categoryType}`);
                  }

                  return isEducation;
                });
                console.log(`CategoryDisplay: Final fallback found ${data.length} education articles`);
              } catch (finalError) {
                console.error('Final fallback also failed:', finalError);
                data = [];
              }
            }

            // Additional client-side filtering to ensure only education trending news
            if (data.length > 0) {
              const originalLength = data.length;
              data = data.filter(article => {
                const categoryType = article.category_type?.toLowerCase();
                const category = article.category?.toLowerCase();
                const title = article.title?.toLowerCase() || '';
                const description = article.description?.toLowerCase() || '';

                // More flexible filtering - accept education content even if not perfectly categorized
                const isEducation = categoryType === 'education' ||
                                 category === 'education' ||
                                 title.includes('education') ||
                                 title.includes('school') ||
                                 title.includes('university') ||
                                 title.includes('college') ||
                                 title.includes('student') ||
                                 title.includes('teacher') ||
                                 title.includes('learning') ||
                                 title.includes('academic') ||
                                 title.includes('study') ||
                                 title.includes('research') ||
                                 description.includes('education');

                const isTrending = category === 'trending' || category === 'education';

                if (!isEducation || !isTrending) {
                  console.log(`CategoryDisplay: Filtering out article: "${article.title}" - category_type: ${categoryType}, category: ${category}`);
                }
                return isEducation && isTrending;
              });
              console.log(`CategoryDisplay: Filtered from ${originalLength} to ${data.length} education articles`);
            }
          }
        } else if (normalizedCategory === 'local') {
          console.log(`CategoryDisplay: Processing local category with apiMethod: ${apiMethod}`);
          console.log(`CategoryDisplay: API Client base URL:`, apiClient.defaults.baseURL);
          console.log(`CategoryDisplay: API Client timeout:`, apiClient.defaults.timeout);
          
          if (apiMethod === 'excluding_trending') {
            // Use local news excluding trending category for featured stories
            data = await cachedTrendingApi.getLocalNewsExcludingTrending(limit * 2);
            console.log(`CategoryDisplay: Using local news excluding trending for featured stories`);
          } else if (apiMethod === 'trending') {
            // Use local trending news API with category_type=local and category=trending
            data = await cachedTrendingApi.getLatestTrendingLocalNews(limit * 2);
            // Additional client-side filtering to ensure only local trending news
            data = data.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              const isLocal = categoryType === 'local';
              const isTrending = category === 'trending';
              if (!isLocal || !isTrending) {
                console.log(`CategoryDisplay: Filtering out non-local-trending article: "${article.title}" - category_type: ${categoryType}, category: ${category}`);
              }
              return isLocal && isTrending;
            });
          } else {
            // Default behavior - use local trending news (same pattern as sports)
            try {
              console.log(`CategoryDisplay: Attempting to fetch local trending news...`);
              data = await cachedTrendingApi.getLatestTrendingLocalNews(limit * 2);
              console.log(`CategoryDisplay: Received ${data.length} local trending articles from API`);
              
              // If no data from API, try fallback
              if (data.length === 0) {
                console.log(`CategoryDisplay: No local data from API, trying fallback...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for fallback`);
                
                data = allTrendingData.filter(item => {
                  const source = item.source?.toLowerCase();
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';
                  
                  // Check if it's local-related by multiple criteria
                  const isLocalByCategory = category === 'local';
                  const isLocalByCategoryType = categoryType === 'local';
                  const isLocalByContent = title.includes('local') || 
                                          title.includes('city') || 
                                          title.includes('town') || 
                                          title.includes('community') || 
                                          title.includes('neighborhood') || 
                                          title.includes('district') ||
                                          title.includes('region') ||
                                          title.includes('area') ||
                                          description.includes('local') ||
                                          description.includes('city') ||
                                          description.includes('community');
                  
                  const isLocal = isLocalByCategory || isLocalByCategoryType || isLocalByContent;
                  
                  if (isLocal) {
                    console.log(`CategoryDisplay: Found local article in fallback: "${item.title}" - source: ${source}, category: ${category}, category_type: ${categoryType}`);
                  }
                  
                  return isLocal;
                });
                console.log(`CategoryDisplay: Fallback found ${data.length} local articles`);
              }
            } catch (localError) {
              console.error('Local trending API failed completely:', localError);
              // Final fallback - try general trending news
              try {
                console.log(`CategoryDisplay: Trying final fallback with general trending news...`);
                const allTrendingData = await cachedTrendingApi.getLatestTrendingNews(limit * 3);
                console.log(`CategoryDisplay: Got ${allTrendingData.length} total trending articles for final fallback`);
                
                data = allTrendingData.filter(item => {
                  const source = item.source?.toLowerCase();
                  const category = item.category?.toLowerCase();
                  const categoryType = item.category_type?.toLowerCase();
                  const title = item.title?.toLowerCase() || '';
                  const description = item.description?.toLowerCase() || '';
                  
                  // Check if it's local-related by multiple criteria
                  const isLocalByCategory = category === 'local';
                  const isLocalByCategoryType = categoryType === 'local';
                  const isLocalByContent = title.includes('local') || 
                                          title.includes('city') || 
                                          title.includes('town') || 
                                          title.includes('community') || 
                                          title.includes('neighborhood') || 
                                          title.includes('district') ||
                                          title.includes('region') ||
                                          title.includes('area') ||
                                          description.includes('local') ||
                                          description.includes('city') ||
                                          description.includes('community');
                  
                  const isLocal = isLocalByCategory || isLocalByCategoryType || isLocalByContent;
                  
                  if (isLocal) {
                    console.log(`CategoryDisplay: Found local article in final fallback: "${item.title}" - source: ${source}, category: ${category}, category_type: ${categoryType}`);
                  }
                  
                  return isLocal;
                });
                console.log(`CategoryDisplay: Final fallback found ${data.length} local articles`);
              } catch (finalError) {
                console.error('Final fallback also failed:', finalError);
                data = [];
              }
            }
            
            // Additional client-side filtering to ensure only local trending news
            if (data.length > 0) {
              const originalLength = data.length;
              data = data.filter(article => {
                const categoryType = article.category_type?.toLowerCase();
                const category = article.category?.toLowerCase();
                const source = article.source?.toLowerCase();
                const title = article.title?.toLowerCase() || '';
                const description = article.description?.toLowerCase() || '';
                
                // More flexible filtering - accept local content even if not perfectly categorized
                const isLocal = categoryType === 'local' || 
                               category === 'local' || 
                               title.includes('local') ||
                               title.includes('city') ||
                               title.includes('town') ||
                               title.includes('community') ||
                               title.includes('neighborhood') ||
                               title.includes('district') ||
                               title.includes('region') ||
                               description.includes('local');
                
                const isTrending = category === 'trending' || category === 'local';
                
                if (!isLocal || !isTrending) {
                  console.log(`CategoryDisplay: Filtering out article: "${article.title}" - category_type: ${categoryType}, category: ${category}, source: ${source}`);
                }
                return isLocal && isTrending;
              });
              console.log(`CategoryDisplay: Filtered from ${originalLength} to ${data.length} local articles`);
            }
          }
        } else if (['health', 'technology', 'entertainment', 'politics', 'science', 'environment'].includes(normalizedCategory)) {
          // Use category-specific API
          data = await cachedTrendingApi.getTrendingNewsByCategory(normalizedCategory, 1, limit * 2);
        } else {
          // Default to general trending news
          data = await cachedTrendingApi.getLatestTrendingNews(limit * 2);
        }
        
        // If no data for trending category, create sample data
        if (normalizedCategory === 'trending' && data.length === 0) {
          console.log('CategoryDisplay: No trending data found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🔥 Climate Summit 2025: Global Leaders Commit to Net Zero",
              description: "World leaders gather in Paris to announce ambitious climate targets and renewable energy investments worth $2 trillion.",
              content: "World leaders from over 190 countries gathered in Paris today for the 2025 Climate Summit, marking a historic moment in global climate action.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Sarah Johnson",
              is_trending: true,
              trending_score: 95.5,
              trending_rank: 1,
              views_count: 15420,
              likes_count: 892,
              is_live: true
            },
            {
              id: 2,
              title: "🚀 Breakthrough in Quantum Computing Achieved",
              description: "Scientists at MIT announce a major breakthrough in quantum computing that could revolutionize data processing.",
              content: "Researchers at the Massachusetts Institute of Technology have achieved a groundbreaking milestone in quantum computing, successfully maintaining quantum coherence for over 10 minutes.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Dr. Michael Chen",
              is_trending: true,
              trending_score: 88.3,
              trending_rank: 2,
              views_count: 12350,
              likes_count: 756,
              is_live: true
            },
            {
              id: 3,
              title: "💼 Economic Policy Changes Impact Global Markets",
              description: "New economic policies announced by major economies are causing significant movements in global financial markets.",
              content: "New economic policies announced by major economies are causing significant movements in global financial markets. Investors are closely watching the developments.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Robert Williams",
              is_trending: true,
              trending_score: 82.7,
              trending_rank: 3,
              views_count: 9870,
              likes_count: 543,
              is_live: true
            },
            {
              id: 4,
              title: "🏥 Medical Innovation: New Cancer Treatment Shows Promise",
              description: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients.",
              content: "Revolutionary new cancer treatment shows 85% success rate in clinical trials, offering hope to millions of patients. The breakthrough could change cancer care forever.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Dr. Emily Rodriguez",
              is_trending: true,
              trending_score: 78.9,
              trending_rank: 4,
              views_count: 8760,
              likes_count: 432,
              is_live: true
            },
            {
              id: 5,
              title: "🌌 Space Mission Discovers Water on Mars",
              description: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization.",
              content: "Latest Mars rover mission discovers significant water deposits, bringing us closer to potential human colonization. This discovery opens new possibilities for space exploration.",
              image_url: "https://picsum.photos/800/400?random=5",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Space Reporter",
              is_trending: true,
              trending_score: 75.3,
              trending_rank: 5,
              views_count: 7650,
              likes_count: 321,
              is_live: true
            },
            {
              id: 6,
              title: "🎓 Education Technology Revolution",
              description: "New AI-powered learning platforms are transforming education worldwide, making quality education accessible to millions.",
              content: "Artificial intelligence is revolutionizing education with new learning platforms that adapt to individual student needs and make quality education accessible worldwide.",
              image_url: "https://picsum.photos/800/400?random=6",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "trending",
              source: "trending",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 72.1,
              trending_rank: 6,
              views_count: 6540,
              likes_count: 298,
              is_live: true
            }
          ];
          console.log('CategoryDisplay: Created sample trending data:', data.length, 'articles');
        }
        
        // If no data for sports, business, or education, create sample data
        if (normalizedCategory === 'sports' && data.length === 0) {
          console.log('CategoryDisplay: No sports data found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🏆 Latest Sports Updates",
              description: "Stay tuned for the latest sports news and updates from around the world.",
              content: "Sports news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "⚽ Sports Championship Updates",
              description: "Get the latest updates from major sports championships happening worldwide.",
              content: "Championship updates and results will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🏀 Basketball League News",
              description: "Latest updates from professional basketball leagues around the world.",
              content: "Basketball news and updates will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 90
            },
            {
              id: 4,
              title: "🏈 Football League Updates",
              description: "Latest news from professional football leagues worldwide.",
              content: "Football news and updates will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "sport",
              source: "sports",
              author: "Sports Reporter",
              is_trending: true,
              trending_score: 85
            }
          ];
          console.log('CategoryDisplay: Created sample sports data:', data.length, 'articles');
        } else if (normalizedCategory === 'business' && data.length === 0) {
          console.log('CategoryDisplay: No business data found, creating sample data...');
          data = [
            {
              id: 1,
              title: "💼 Latest Business Updates",
              description: "Stay tuned for the latest business news and market updates from around the world.",
              content: "Business news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "business",
              source: "business",
              author: "Business Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "📈 Market Analysis Updates",
              description: "Get the latest market analysis and financial updates from global markets.",
              content: "Market analysis and financial updates will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "business",
              source: "business",
              author: "Business Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🏢 Corporate News Updates",
              description: "Latest updates from major corporations and business developments worldwide.",
              content: "Corporate news and business developments will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "business",
              source: "business",
              author: "Business Reporter",
              is_trending: true,
              trending_score: 90
            },
            {
              id: 4,
              title: "💰 Financial Market Updates",
              description: "Latest news from financial markets and investment opportunities worldwide.",
              content: "Financial market news and investment updates will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "business",
              source: "business",
              author: "Business Reporter",
              is_trending: true,
              trending_score: 85
            }
          ];
          console.log('CategoryDisplay: Created sample business data:', data.length, 'articles');
        } else if (normalizedCategory === 'education' && data.length === 0) {
          console.log('CategoryDisplay: No education data found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🎓 Latest Education Updates",
              description: "Stay tuned for the latest education news and academic updates from around the world.",
              content: "Education news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "📚 Academic Research Updates",
              description: "Get the latest updates from universities and research institutions worldwide.",
              content: "Academic research and university updates will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🏫 School News Updates",
              description: "Latest updates from schools and educational institutions worldwide.",
              content: "School news and educational developments will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 90
            },
            {
              id: 4,
              title: "🎓 Student Life Updates",
              description: "Latest news about student life, scholarships, and educational opportunities worldwide.",
              content: "Student life and educational opportunities will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: true,
              trending_score: 85
            }
          ];
          console.log('CategoryDisplay: Created sample education data:', data.length, 'articles');
        } else if (normalizedCategory === 'education' && data.length === 0 && apiMethod === 'excluding_trending') {
          console.log('CategoryDisplay: No education news excluding trending found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🎓 University Admission Updates",
              description: "Latest updates on university admissions and enrollment processes for the upcoming academic year.",
              content: "University admission news and updates will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "education",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: false,
              trending_score: 50
            },
            {
              id: 2,
              title: "📚 Curriculum Development News",
              description: "New curriculum developments and educational program updates from institutions worldwide.",
              content: "Curriculum development and educational program news will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "education",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: false,
              trending_score: 45
            },
            {
              id: 3,
              title: "🏫 School Infrastructure Updates",
              description: "Latest news about school infrastructure improvements and educational facility developments.",
              content: "School infrastructure and facility development news will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "education",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: false,
              trending_score: 40
            },
            {
              id: 4,
              title: "👨‍🏫 Teacher Training Programs",
              description: "Updates on teacher training programs and professional development initiatives in education.",
              content: "Teacher training and professional development news will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "education",
              category_type: "education",
              source: "education",
              author: "Education Reporter",
              is_trending: false,
              trending_score: 35
            }
          ];
          console.log('CategoryDisplay: Created sample education news excluding trending data:', data.length, 'articles');
        } else if (normalizedCategory === 'local' && data.length === 0) {
          console.log('CategoryDisplay: No local data found, creating sample data...');
          data = [
            {
              id: 1,
              title: "🏘️ Latest Local Updates",
              description: "Stay tuned for the latest local news and community updates from your area.",
              content: "Local news content will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=1",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "local",
              source: "local",
              author: "Local Reporter",
              is_trending: true,
              trending_score: 100
            },
            {
              id: 2,
              title: "🏛️ City Council Updates",
              description: "Get the latest updates from city council meetings and local government decisions.",
              content: "City council updates and local government news will be shown here.",
              image_url: "https://picsum.photos/800/400?random=2",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "local",
              source: "local",
              author: "Local Reporter",
              is_trending: true,
              trending_score: 95
            },
            {
              id: 3,
              title: "🚧 Community Development News",
              description: "Latest updates on community development projects and local infrastructure improvements.",
              content: "Community development and infrastructure news will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=3",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "local",
              source: "local",
              author: "Local Reporter",
              is_trending: true,
              trending_score: 90
            },
            {
              id: 4,
              title: "🎪 Local Events & Activities",
              description: "Latest news about local events, festivals, and community activities happening in your area.",
              content: "Local events and community activities will be displayed here.",
              image_url: "https://picsum.photos/800/400?random=4",
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              category: "trending",
              category_type: "local",
              source: "local",
              author: "Local Reporter",
              is_trending: true,
              trending_score: 85
            }
          ];
          console.log('CategoryDisplay: Created sample local data:', data.length, 'articles');
        }
        
        console.log(`CategoryDisplay (${normalizedCategory}): Received ${data.length} articles after filtering`);
        setNewsData(data);
        setFilteredData(data.slice(0, limit));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news data');
        setNewsData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [category, limit, apiMethod]);

  // Handle sorting and filtering
  useEffect(() => {
    let sortedData = [...newsData];
    
    switch (sortBy) {
      case 'trending':
        sortedData = sortedData.sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0));
        break;
      case 'popular':
        sortedData = sortedData.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case 'latest':
      default:
        sortedData = sortedData.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || new Date());
          const dateB = new Date(b.published_at || b.created_at || new Date());
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }
    
    // Show all data if showAll is true, otherwise show limited data
    setFilteredData(showAll ? sortedData : sortedData.slice(0, limit));
  }, [newsData, sortBy, limit, showAll]);

  // Handle View More button click
  const handleViewMore = async () => {
    if (showAll) {
      // If already showing all, go back to limited view
      setShowAll(false);
      return;
    }

    setLoadingMore(true);
    try {
      // If we have more data available, show all
      if (newsData.length > limit) {
        setShowAll(true);
      } else {
        // If we need to fetch more data, do so
        const newLimit = limit * 2;
        let newData: TrendingNewsResponse[] = [];
        
        // Fetch more data based on category
        const normalizedCategory = category.toLowerCase();
        
        if (normalizedCategory === 'national') {
          newData = await cachedTrendingApi.getNationalTrendingNews(newLimit);
          // Client-side filtering to ensure only national news
          newData = newData.filter(article => {
            const source = article.source?.toLowerCase();
            return source === 'national';
          });
        } else if (normalizedCategory === 'world') {
          if (apiMethod === 'excluding_trending') {
            newData = await cachedTrendingApi.getWorldNewsExcludingTrending(newLimit);
          } else {
            newData = await cachedTrendingApi.getWorldTrendingNews(newLimit);
            // Client-side filtering to ensure only world news
            newData = newData.filter(article => {
              const source = article.source?.toLowerCase();
              return source === 'world';
            });
          }
        } else if (normalizedCategory === 'sports') {
          if (apiMethod === 'excluding_trending') {
            newData = await cachedTrendingApi.getSportsNewsExcludingTrending(newLimit);
          } else if (apiMethod === 'trending') {
            newData = await cachedTrendingApi.getLatestTrendingSportsNews(newLimit);
            // Additional client-side filtering to ensure only sports trending news
            newData = newData.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              return categoryType === 'sport' && category === 'trending';
            });
          } else {
            // Default behavior - use sports trending news (similar to national)
            newData = await cachedTrendingApi.getLatestTrendingSportsNews(newLimit);
            // Additional client-side filtering to ensure only sports trending news
            newData = newData.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              return categoryType === 'sport' && category === 'trending';
            });
          }
        } else if (normalizedCategory === 'local') {
          if (apiMethod === 'excluding_trending') {
            newData = await cachedTrendingApi.getLocalNewsExcludingTrending(newLimit);
          } else if (apiMethod === 'trending') {
            newData = await cachedTrendingApi.getLatestTrendingLocalNews(newLimit);
            // Additional client-side filtering to ensure only local trending news
            newData = newData.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              return categoryType === 'local' && category === 'trending';
            });
          } else {
            // Default behavior - use local trending news (similar to sports)
            newData = await cachedTrendingApi.getLatestTrendingLocalNews(newLimit);
            // Additional client-side filtering to ensure only local trending news
            newData = newData.filter(article => {
              const categoryType = article.category_type?.toLowerCase();
              const category = article.category?.toLowerCase();
              return categoryType === 'local' && category === 'trending';
            });
          }
        } else if (['business', 'education', 'health', 'technology', 'entertainment', 'politics', 'science', 'environment'].includes(normalizedCategory)) {
          newData = await cachedTrendingApi.getTrendingNewsByCategory(normalizedCategory, 1, newLimit);
        } else {
          newData = await cachedTrendingApi.getLatestTrendingNews(newLimit);
        }
        
        setNewsData(newData);
        setShowAll(true);
      }
    } catch (err) {
      console.error('Error loading more news:', err);
      setError('Failed to load more news');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle Show Less button click
  const handleShowLess = () => {
    setShowAll(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="category-display">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading {displayName}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && newsData.length === 0) {
    return (
      <div className="category-display">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}. Please try again later.
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && !error && newsData.length === 0) {
    return (
      <div className="category-display">
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          No {displayName.toLowerCase()} available at the moment. Please check back later.
        </div>
      </div>
    );
  }

  // Render different layouts
  const renderGridLayout = () => (
    <div className="row g-3">
      {filteredData.map((news) => (
        <div key={news.id} className="col-lg-4 col-md-6">
          <div 
            className="card h-100 shadow-sm border-0 category-news-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/category-news/${news.id}`)}
          >
            <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
              {news.image_url ? (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="card-img-top w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/400/200?random=${news.id}`;
                  }}
                />
              ) : (
                <div 
                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ background: `linear-gradient(135deg, ${categoryStyle.color}20 0%, ${categoryStyle.color}40 100%)` }}
                >
                  <i className={`bi ${categoryStyle.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                </div>
              )}
            </div>
            <div className="card-body d-flex flex-column">
              <h6 className="card-title fw-bold mb-2" style={{ 
                fontSize: '0.95rem',
                lineHeight: '1.3',
                minHeight: '2.6rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {news.title}
              </h6>
              {news.description && (
                <p className="card-text text-muted flex-grow-1" style={{
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  minHeight: '2.8rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {news.description}
                </p>
              )}
              <div className="mt-3">
                <small className="text-muted d-block mb-1">
                  <i className="bi bi-person me-1"></i>
                  {news.author || 'Unknown'}
                </small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="list-group list-group-flush">
      {filteredData.map((news) => (
        <div 
          key={news.id} 
          className="list-group-item list-group-item-action border-0 px-0 py-3 category-list-item"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/category-news/${news.id}`)}
        >
          <div className="d-flex align-items-start">
            <div className="flex-shrink-0 me-3">
              {news.image_url ? (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="rounded"
                  style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/80/60?random=${news.id}`;
                  }}
                />
              ) : (
                <div 
                  className="rounded d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '80px', 
                    height: '60px', 
                    background: `linear-gradient(135deg, ${categoryStyle.color}20 0%, ${categoryStyle.color}40 100%)` 
                  }}
                >
                  <i className={`bi ${categoryStyle.icon} text-white`} style={{ fontSize: '1.2rem' }}></i>
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold" style={{ 
                fontSize: '0.95rem',
                lineHeight: '1.3',
                minHeight: '2.6rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {news.title}
              </h6>
              <p className="mb-0 text-muted" style={{ 
                fontSize: '0.8rem', 
                lineHeight: '1.4',
                minHeight: '2.8rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {news.description}
              </p>
            </div>
            <i className="bi bi-chevron-right text-muted ms-2"></i>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {filteredData.map((news, index) => (
          <div key={news.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div 
              className="card border-0 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/category-news/${news.id}`)}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="img-fluid rounded-start h-100"
                      style={{ objectFit: 'cover', minHeight: '200px' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/400/200?random=${news.id}`;
                      }}
                    />
                  ) : (
                    <div 
                      className="h-100 d-flex align-items-center justify-content-center rounded-start"
                      style={{ 
                        minHeight: '200px',
                        background: `linear-gradient(135deg, ${categoryStyle.color}20 0%, ${categoryStyle.color}40 100%)` 
                      }}
                    >
                      <i className={`bi ${categoryStyle.icon} text-white`} style={{ fontSize: '3rem' }}></i>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <div className="card-body h-100 d-flex flex-column">
                    <h5 className="card-title fw-bold mb-3">{news.title}</h5>
                    <p className="card-text flex-grow-1">{news.description}</p>
                    <div className="mt-auto">
                      <small className="text-muted">
                        By {news.author || 'Unknown'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredData.length > 1 && (
        <>
          <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );

  const renderFeaturedLayout = () => {
    const featuredNews = filteredData[0];
    const otherNews = filteredData.slice(1);
    
    return (
      <div>
        {/* Featured Article */}
        {featuredNews && (
          <div className="row mb-4">
            <div className="col-12">
              <div 
                className="card border-0 shadow-sm featured-article"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/category-news/${featuredNews.id}`)}
              >
                <div className="row g-0">
                  <div className="col-lg-6">
                    {featuredNews.image_url ? (
                      <img
                        src={featuredNews.image_url}
                        alt={featuredNews.title}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover', minHeight: '300px' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/600/300?random=${featuredNews.id}`;
                        }}
                      />
                    ) : (
                      <div 
                        className="h-100 d-flex align-items-center justify-content-center rounded-start"
                        style={{ 
                          minHeight: '300px',
                          background: `linear-gradient(135deg, ${categoryStyle.color}20 0%, ${categoryStyle.color}40 100%)` 
                        }}
                      >
                        <i className={`bi ${categoryStyle.icon} text-white`} style={{ fontSize: '4rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <div className="card-body h-100 d-flex flex-column p-4">
                      <h3 className="card-title fw-bold mb-3">{featuredNews.title}</h3>
                      <p className="card-text flex-grow-1 fs-5">{featuredNews.description}</p>
                      <div className="mt-auto">
                        <small className="text-muted">
                          By {featuredNews.author || 'Unknown'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other Articles */}
        <div className="row g-3">
          {otherNews.map((news) => (
            <div key={news.id} className="col-lg-4 col-md-6">
              <div 
                className="card h-100 shadow-sm border-0 category-news-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/category-news/${news.id}`)}
              >
                <div className="card-img-top-container" style={{ height: '150px', overflow: 'hidden' }}>
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/400/150?random=${news.id}`;
                      }}
                    />
                  ) : (
                    <div 
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: `linear-gradient(135deg, ${categoryStyle.color}20 0%, ${categoryStyle.color}40 100%)` }}
                    >
                      <i className={`bi ${categoryStyle.icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
                    </div>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-2" style={{ 
                    fontSize: '0.95rem',
                    lineHeight: '1.3',
                    minHeight: '2.6rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {news.title}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (layout) {
      case 'list':
        return renderListLayout();
      case 'carousel':
        return renderCarouselLayout();
      case 'featured':
        return renderFeaturedLayout();
      case 'grid':
      default:
        return renderGridLayout();
    }
  };

  return (
    <div className="category-display">
      {showHeader && category !== 'trending' && (
        <div className="category-header mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div 
                className="category-icon me-3 d-flex align-items-center justify-content-center"
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1e40af20',
                  color: categoryStyle.color
                }}
              >
                <i className={`bi ${categoryStyle.icon}`} style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h5 className="section-title mb-0" style={{ color: categoryStyle.color }}>
                  {displayName}
                </h5>
                <p className="text-muted mb-0">
                  {filteredData.length} {filteredData.length === 1 ? 'article' : 'articles'} displayed
                  {!showAll && newsData.length > limit && ` • ${newsData.length - limit} more available`}
                </p>
              </div>
            </div>
            {showFilters && (
              <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0">Sort by:</label>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'trending' | 'popular')}
                >
                  <option value="latest">Latest</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {error && newsData.length > 0 && (
        <div className="alert alert-info alert-sm mb-3" role="alert">
          <i className="bi bi-info-circle me-1"></i>
          Showing cached data. Some articles may not be up to date.
        </div>
      )}

      {renderContent()}

      {showViewMore && (
        <div className="text-center mt-4">
          {!showAll && newsData.length > limit && (
            <button 
              className="btn btn-primary me-3 px-4 py-2"
              onClick={handleViewMore}
              disabled={loadingMore}
              style={{ borderRadius: '25px' }}
            >
              {loadingMore ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Loading More...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  View More ({newsData.length - limit} more articles)
                </>
              )}
            </button>
          )}
          
          {showAll && (
            <button 
              className="btn btn-outline-secondary px-4 py-2"
              onClick={handleShowLess}
              style={{ borderRadius: '25px' }}
            >
              <i className="bi bi-dash-circle me-2"></i>
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDisplay;