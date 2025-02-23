"use client";
import React,{ useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { Category } from '@/types/category';
import { BASE_URL } from '@/helper/apiRequest';

interface CategoryCardProps {
  category: Category;
  classname?: any | undefined;
  handleEditClick: (category: Category ) => void; 
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category,classname,handleEditClick }) => {

  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = category?.categoryImagePath
  ? `${BASE_URL}${category.categoryImagePath}`
  : '/images/category/finearts.jpeg';
  return (
    <div 
      className={classname ? classname :`relative p-4 border rounded-lg shadow-md h-40 flex items-end bg-cover bg-center`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <img
        src={imageUrl}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectFit: 'cover' }}
        crossOrigin="anonymous" // CORS for images
      />
      {isHovered && (
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow" 
        onClick={()=>handleEditClick(category)}
        >
          <FaEdit size={20} className="text-gray-600" />
        </button>
      )}
      <div className="w-full bg-black bg-opacity-50 text-white text-center p-2 rounded-b-lg">
        <span className="font-semibold text-lg">{category.categoryName}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
