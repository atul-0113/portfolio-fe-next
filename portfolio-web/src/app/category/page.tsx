"use client"
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import CategoryCard from "@/components/Cards";
import { categories } from "@/data/dummyData";


const Category = () => {
  const router = useRouter();
  const goToAddCategory = () => {
    router.push(`/category/addCategory`);
  };
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Category</h1>
          <button
            onClick={goToAddCategory}
            className="inline-flex items-center justify-center rounded-md bg-graydark px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Category;
