// Category mapping utility for converting URL categories to category_type from trending_news table
export const getCategoryType = (urlCategory?: string): string | null => {
  if (!urlCategory) return null;

  const categoryMapping: { [key: string]: string } = {
    'national': 'national',
    'nation': 'national', // alias
    'international': 'world',
    'world': 'world', // alias
    'sports': 'sports',
    'business': 'business',
    'education': 'education',
    'local': 'local',
    'trending': 'trending',
    'public': 'public',
    'health': 'health',
    'technology': 'technology',
    'tech': 'technology', // alias for short form
    'entertainment': 'entertainment',
    'politics': 'politics',
    'science': 'science',
    'environment': 'environment'
  };

  const normalized = urlCategory.toLowerCase();
  return categoryMapping[normalized] || null;
};

// Available category types in the trending_news table
export const AVAILABLE_CATEGORY_TYPES: string[] = [
  'national',
  'world',
  'sports',
  'business',
  'education',
  'local',
  'trending',
  'public',
  'health',
  'technology',
  'entertainment',
  'politics',
  'science',
  'environment'
];

// Get display name for category type
export const getCategoryDisplayName = (categoryType: string): string => {
  const displayNames: { [key: string]: string } = {
    'national': 'National',
    'world': 'World',
    'sports': 'Sports',
    'business': 'Business',
    'education': 'Education',
    'local': 'Local',
    'trending': 'Trending',
    'public': 'Public',
    'health': 'Health',
    'technology': 'Technology',
    'entertainment': 'Entertainment',
    'politics': 'Politics',
    'science': 'Science',
    'environment': 'Environment'
  };

  return displayNames[categoryType] || categoryType;
};
