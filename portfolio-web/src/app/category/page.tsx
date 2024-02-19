import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

import CategoryCard from "@/components/Cards";
import { categories } from "@/data/dummyData";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Calender | Portfolio - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for Portfolio  Tailwind CSS Admin Dashboard Template",
};

const Category = () => {
  return (
    <DefaultLayout>
           <div className="mx-auto max-w-242.5">
           <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Category</h1>
           <button
              // href="#"
              className="inline-flex items-center justify-center rounded-md bg-graydark px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add Category
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <CategoryCard key={index} category={category} />
      ))}
    </div>
    </div>
    </DefaultLayout>
  );
};

export default Category;
