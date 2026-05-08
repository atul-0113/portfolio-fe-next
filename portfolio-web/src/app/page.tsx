"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/auth/AuthContext";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiChevronDown,
  FiEdit3,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";

const features = [
  {
    icon: <FiEdit3 size={20} />,
    title: "AI-Powered Writing",
    description:
      "Generate crisp summaries, project descriptions, and portfolio copy that keeps your voice intact.",
  },
  {
    icon: <FiBarChart2 size={20} />,
    title: "Visitor Insights",
    description:
      "Understand what recruiters view, which projects stand out, and where attention drops.",
  },
  {
    icon: <FiGlobe size={20} />,
    title: "Theme Assistant",
    description:
      "Keep resume, portfolio, and template styling consistent across every touchpoint.",
  },
  {
    icon: <FiFileText size={20} />,
    title: "ATS-Ready Resumes",
    description:
      "Create structured resumes designed for applicant tracking systems and human readers.",
    dark: true,
  },
];

const templates = [
  {
    image: "/images/product/product-01.png",
    title: "Linear Minimal",
    subtitle: "Best for Product Designers",
  },
  {
    image: "/images/product/product-02.png",
    title: "Mono Dev",
    subtitle: "Best for Software Engineers",
  },
  {
    image: "/images/product/product-03.png",
    title: "Bold Strategy",
    subtitle: "Best for Marketing Professionals",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    suffix: "/forever",
    items: ["1 Portfolio Site", "Standard Templates", "3 Resume Exports"],
    action: "Start Free",
  },
  {
    name: "Pro",
    price: "$12",
    suffix: "/month",
    items: ["Unlimited Portfolios", "AI Content Generation", "Custom Domains", "Priority Support"],
    action: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$39",
    suffix: "/month",
    items: ["5 Team Seats", "Shared Asset Library", "Custom Branding"],
    action: "Contact Sales",
  },
];

const faqs = [
  "Can I export my resume to PDF?",
  "How does the AI optimization work?",
  "Can I use my own domain?",
];

export default function LandingPage() {
  const { user } = useAuth();
  const profileName = user?.name || user?.email || "Profile";

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold text-[#3525cd]">
            PortfolioPro
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#464555] md:flex">
            <a href="#features" className="border-b-2 border-[#3525cd] py-5 text-[#3525cd]">
              Features
            </a>
            <a href="#templates" className="py-5 hover:text-[#191c1d]">
              Templates
            </a>
            <a href="#pricing" className="py-5 hover:text-[#191c1d]">
              Pricing
            </a>
            <a href="#showcase" className="py-5 hover:text-[#191c1d]">
              Showcase
            </a>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-md bg-[#3525cd] px-4 py-2 text-sm font-medium text-white hover:bg-[#4f46e5]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-sm font-medium text-[#191c1d] hover:bg-[#f3f4f5]"
              >
                <Image
                  src="/images/user/user-01.png"
                  alt={profileName}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="hidden max-w-32 truncate sm:inline">{profileName}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="rounded-md px-4 py-2 text-sm font-medium text-[#191c1d] hover:bg-[#f3f4f5]"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-[#3525cd] px-4 py-2 text-sm font-medium text-white hover:bg-[#4f46e5]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      <section id="showcase" className="bg-white px-6 pb-24 pt-28">
        <div className="mx-auto max-w-[1200px] text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded border border-[#c7c4d8] bg-[#f3f4f5] px-3 py-1 text-xs text-[#464555]">
            <span className="font-medium text-[#3525cd]">NEW</span>
            AI-Powered ATS Optimization is here
          </div>

          <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-tight text-[#191c1d] md:text-6xl">
            Build your professional future with AI.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#464555]">
            Deploy stunning portfolios, optimize resumes for ATS, and land your dream role with
            the ultimate workspace for modern professionals.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-md bg-[#3525cd] px-8 py-3 text-sm font-medium text-white hover:bg-[#4f46e5]"
            >
              Create Your Portfolio
            </Link>
            <Link
              href="/templates"
              className="rounded-md border border-[#c7c4d8] bg-white px-8 py-3 text-sm font-medium text-[#191c1d] hover:bg-[#f3f4f5]"
            >
              View Templates
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-lg border border-[#c7c4d8] bg-[#0f172a] p-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)]">
            <div className="relative aspect-[16/9] overflow-hidden rounded bg-[#101415]">
              <Image
                src="/images/product/product-04.png"
                alt="PortfolioPro dashboard preview"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#e5e7eb] bg-[#f3f4f5] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10">
            <p className="text-sm font-medium text-[#191c1d]">Professional Features</p>
            <p className="mt-2 text-sm text-[#464555]">
              Everything you need to showcase your talent.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`rounded-lg border p-6 ${
                  feature.dark
                    ? "border-[#2e3132] bg-[#191c1d] text-white"
                    : "border-[#e5e7eb] bg-white text-[#191c1d]"
                }`}
              >
                <div className={feature.dark ? "text-[#c3c0ff]" : "text-[#3525cd]"}>
                  {feature.icon}
                </div>
                <h2 className="mt-4 text-base font-semibold">{feature.title}</h2>
                <p className={`mt-2 text-sm leading-6 ${feature.dark ? "text-[#f0f1f2]" : "text-[#464555]"}`}>
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-[#191c1d]">Premium Templates</p>
              <p className="mt-2 text-sm text-[#464555]">
                Meticulously designed for various career stages.
              </p>
            </div>
            <Link
              href="/templates"
              className="hidden items-center gap-2 text-sm font-medium text-[#3525cd] sm:inline-flex"
            >
              Browse all templates <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((template) => (
              <article key={template.title}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f4f5]">
                  <Image
                    src={template.image}
                    alt={`${template.title} template preview`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#191c1d]">{template.title}</h3>
                <p className="mt-1 text-sm text-[#464555]">{template.subtitle}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-[#e5e7eb] bg-[#f3f4f5] px-6 py-16">
        <div className="mx-auto max-w-[960px]">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium text-[#191c1d]">Simple Pricing</p>
            <p className="mt-2 text-sm text-[#464555]">
              Invest in your career. Scalable for any stage.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-lg border bg-white p-6 ${
                  plan.popular ? "border-[#3525cd]" : "border-[#e5e7eb]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-[#3525cd] px-3 py-1 text-xs font-semibold text-white">
                    MOST POPULAR
                  </span>
                )}
                <p className="text-sm text-[#464555]">{plan.name}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-semibold text-[#191c1d]">{plan.price}</span>
                  <span className="pb-1 text-sm text-[#464555]">{plan.suffix}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#464555]">
                      <FiCheckCircle size={15} className="text-[#3525cd]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.popular ? "/auth/signup" : "/auth/signup"}
                  className={`mt-8 inline-flex w-full justify-center rounded-md border px-4 py-3 text-sm font-medium ${
                    plan.popular
                      ? "border-[#3525cd] bg-[#3525cd] text-white hover:bg-[#4f46e5]"
                      : "border-[#c7c4d8] bg-white text-[#191c1d] hover:bg-[#f3f4f5]"
                  }`}
                >
                  {plan.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-[#191c1d]">Common Questions</p>
          </div>

          <div className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
            {faqs.map((faq) => (
              <button
                key={faq}
                type="button"
                className="flex w-full items-center justify-between py-5 text-left text-sm text-[#191c1d]"
              >
                {faq}
                <FiChevronDown size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5e7eb] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 text-sm text-[#464555] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-[#191c1d]">PortfolioPro</p>
            <p className="mt-1">© 2026 PortfolioPro AI. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-[#191c1d]">Privacy Policy</a>
            <a href="#" className="hover:text-[#191c1d]">Terms of Service</a>
            <a href="#" className="hover:text-[#191c1d]">Help Center</a>
            <a href="#" className="hover:text-[#191c1d]">API Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
