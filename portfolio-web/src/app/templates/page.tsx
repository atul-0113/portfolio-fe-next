import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Calender | Portfolio - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for Portfolio  Tailwind CSS Admin Dashboard Template",
};

const Templates = () => {
  return (
    <DefaultLayout>
      <h1>Templates</h1>
    </DefaultLayout>
  );
};

export default Templates;
