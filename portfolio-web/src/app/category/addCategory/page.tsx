"use client";
import { useState,useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useParams ,useRouter} from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
export default function AddCategory() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage]:any = useState(null);
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  
  const handleImageUpload = (event:any) => {
    const file:any = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (id) {
      // Simulating API call to fetch category by ID
      const fetchCategory = async () => {
        // Replace this with real API call
        const category = {
          id,
          name: "Example Category",
          image: "/example-image.jpg",
          isActive: true,
        };

        setCategoryName(category.name);
        setImage(category.image);
        setIsActive(category.isActive);
      };

      fetchCategory();
    }
  }, [id]);

  const handleSubmit = (event:any) => {
    event.preventDefault();
    console.log({ categoryName, image, isActive });
    // Handle form submission logic here
  };

  return (
    <DefaultLayout>
      <div className="flex items-center space-x-4">
       <button
        onClick={() => router.back()}
        className="flex items-center text-black-500 mb-4"
      >
        <FaArrowLeft className="mr-2" />
      </button>
      <h2 className="text-2xl font-semibold mb-4"> Add Category</h2>
      </div>
      <div className="flex justify-center min-h-132.5">
      <form onSubmit={handleSubmit} className="space-y-4 w-80 items-center pt-10">
        {/* Category Name Input */}
        <div>
          <label className="block text-sm font-medium">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Enter category name"
            required
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
          {image && <img src={image} alt="Category Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
        </div>
        
        {/* Toggle Active/Inactive */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-md text-white ${isActive ? 'bg-green-500' : 'bg-red'}`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Add Category
        </button>
      </form>
      </div>
    </DefaultLayout>
  );
}
