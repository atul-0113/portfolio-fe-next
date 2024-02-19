// CategoryCard.tsx

import React from 'react';
import { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      {/* Category Icon */}
      <div className="mb-4">
        <img src={category.icon} alt={category.name} className="w-8 h-8" />
      </div>
      {/* Category Name */}
      <div className="font-semibold text-lg">{category.name}</div>
    </div>
  );
};

export default CategoryCard;
