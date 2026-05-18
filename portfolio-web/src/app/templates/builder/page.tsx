"use client";

import Link from "next/link";
import { FiX } from "react-icons/fi";
import { PortfolioBuilder } from "@/portfolio-engine";

const PortfolioTemplateBuilderPage = () => (
  <main className="relative h-screen overflow-auto bg-[#f8f9fa] px-4 py-4 sm:px-6 sm:py-6">
    <Link
      href="/dashboard"
      className="sticky left-0 top-0 z-20 inline-flex h-10 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-sm font-bold text-[#191c1d] shadow-sm transition hover:border-[#3525cd] hover:text-[#3525cd]"
      aria-label="Close builder and go to dashboard"
    >
      <FiX size={16} />
      Close
    </Link>

    <section className="pt-4">
      <PortfolioBuilder />
    </section>
  </main>
);

export default PortfolioTemplateBuilderPage;
