"use client"
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import TemplateCard from "@/components/Cards/templateCard";
import { categories } from "@/data/dummyData";

const Templates = () => {
  function handleEditclick(data:any){

  }
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Templates</h1>
          <button
            className="inline-flex items-center justify-center rounded-md bg-graydark px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Add Templates
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <TemplateCard key={index} 
            handleEditClick={handleEditclick}
            category={category} 
            classname={"relative p-4 border rounded-lg shadow-md h-70 flex items-end bg-cover bg-center"} />
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Templates;
