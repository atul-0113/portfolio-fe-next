"use client";
import React,{ useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { Category } from '@/types/category';
import { useRouter } from "next/navigation";
interface CategoryCardProps {
  category: Category;
  classname?: any | undefined;
  handleEditClick: (category: Category ) => void; 
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category,classname,handleEditClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={classname ? classname :`relative p-4 border rounded-lg shadow-md h-40 flex items-end bg-cover bg-center`}
      style={{ backgroundImage: `url(${category?.icon})` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow" 
        onClick={()=>handleEditClick(category)}
        >
          <FaEdit size={20} className="text-gray-600" />
        </button>
      )}
      <div className="w-full bg-black bg-opacity-50 text-white text-center p-2 rounded-b-lg">
        <span className="font-semibold text-lg">{category.name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
