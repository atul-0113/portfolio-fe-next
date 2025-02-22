// app/layout.tsx
"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './auth/AuthContext'; // Import useAuth here

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth(); // Get isLoading from AuthContext

  return (
    <>
      {isLoading ? <Loader /> : children}
    </>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}