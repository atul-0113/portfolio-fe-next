"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { colorClasses } from "@/styles/theme";
import { layoutStyles } from "@/styles/ui";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
      <div className={`flex h-screen overflow-hidden ${colorClasses.appBackground} ${colorClasses.text}`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex flex-1 flex-col overflow-y-auto">
            <div className={`${layoutStyles.pageShell} flex-1`}>
              <div className={layoutStyles.pageWide}>
                {children}
              </div>
            </div>
            <footer className={`border-t ${colorClasses.border} bg-white px-6 py-5 lg:px-12`}>
              <div className={`mx-auto flex max-w-[1200px] flex-col gap-4 text-sm ${colorClasses.textMuted} md:flex-row md:items-center md:justify-between`}>
                <div className="flex items-center gap-6">
                  <span className={`text-lg font-semibold ${colorClasses.text}`}>PortfolioPro</span>
                  <span>© 2026 PortfolioPro AI. All rights reserved.</span>
                </div>
                <div className="flex flex-wrap gap-8">
                  <a href="#" className="hover:text-[#191c1d]">Privacy Policy</a>
                  <a href="#" className="hover:text-[#191c1d]">Terms of Service</a>
                  <a href="#" className="hover:text-[#191c1d]">Help Center</a>
                  <a href="#" className="hover:text-[#191c1d]">API Docs</a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
  );
}
