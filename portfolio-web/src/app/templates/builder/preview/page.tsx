"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortfolioRenderer } from "@/portfolio-engine";
import {
  getPortfolioPreviewStorageKey,
  type PortfolioPreviewPayload,
} from "@/portfolio-engine/previewStorage";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isPreviewPayload = (value: unknown): value is PortfolioPreviewPayload =>
  isRecord(value) &&
  isRecord(value.template) &&
  isRecord(value.data) &&
  isRecord(value.template.root) &&
  isRecord(value.template.theme);

const PortfolioBuilderPreviewPage = () => {
  const [previewPayload, setPreviewPayload] = useState<PortfolioPreviewPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const previewId = new URLSearchParams(window.location.search).get("previewId");

    if (!previewId) {
      setError("Preview link is missing. Open preview again from the builder.");
      return;
    }

    const rawPayload = window.localStorage.getItem(getPortfolioPreviewStorageKey(previewId));

    if (!rawPayload) {
      setError("Preview data was not found. Open preview again from the builder.");
      return;
    }

    try {
      const parsedPayload: unknown = JSON.parse(rawPayload);

      if (!isPreviewPayload(parsedPayload)) {
        setError("Preview data is not valid. Open preview again from the builder.");
        return;
      }

      document.title = `${parsedPayload.template.name} Preview`;
      setPreviewPayload(parsedPayload);
    } catch {
      setError("Preview data could not be read. Open preview again from the builder.");
    }
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4">
        <section className="w-full max-w-md rounded-lg border border-[#d9d7e8] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-black text-[#090a0b]">Preview unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#464555]">{error}</p>
          <Link
            href="/templates/builder"
            className="mt-5 inline-flex h-10 items-center rounded-md bg-[#3525cd] px-4 text-sm font-bold text-white transition hover:bg-[#4f46e5]"
          >
            Back to Builder
          </Link>
        </section>
      </main>
    );
  }

  if (!previewPayload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4 text-sm font-bold text-[#464555]">
        Opening preview...
      </main>
    );
  }

  return (
    <PortfolioRenderer
      template={previewPayload.template}
      data={previewPayload.data}
      mode="preview"
    />
  );
};

export default PortfolioBuilderPreviewPage;
