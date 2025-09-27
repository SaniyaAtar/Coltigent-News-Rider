import React from "react";
import CategoryDisplay from "./CategoryDisplay";

interface CategoryNewsFeedProps {
  category?: string;
  layout?: 'grid' | 'list' | 'carousel' | 'featured';
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  showViewMore?: boolean;
}

const CategoryNewsFeed: React.FC<CategoryNewsFeedProps> = ({ 
  category, 
  layout = 'grid',
  limit = 12,
  showHeader = true,
  showFilters = false,
  showViewMore = true
}) => {
  return (
    <div className="category-news-feed-section">
      <CategoryDisplay
        category={category}
        layout={layout}
        limit={limit}
        showHeader={showHeader}
        showFilters={showFilters}
        showViewMore={showViewMore}
      />
    </div>
  );
};

export default CategoryNewsFeed;
