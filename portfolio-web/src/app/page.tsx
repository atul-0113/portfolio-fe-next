// pages/index.tsx
"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AuthGuard from './auth/authGuard'; // Correct path

const HomePage = () => {
  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
};

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}