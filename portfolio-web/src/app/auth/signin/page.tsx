"use client";

import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiShield, FiZap } from "react-icons/fi";
import { useSignInForm } from "@/hooks/useAuthForms";

const SignIn = () => {
  const {
    email,
    error,
    isSubmitting,
    keepSignedIn,
    password,
    setEmail,
    setKeepSignedIn,
    setPassword,
    handleSubmit,
  } = useSignInForm();

  return (
    <main className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#191c1d]">
      <section className="flex flex-1 flex-col items-center px-6 py-10">
        <Link
          href="/"
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-[#3323cc] bg-[#3525cd] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)]"
        >
          <FiZap size={24} />
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#191c1d]">
            PortfolioPro
          </h1>
          <p className="mt-2 text-sm text-[#464555]">
            Welcome back to your professional space
          </p>
        </div>

        <div className="w-full max-w-lg rounded-lg border border-[#c7c4d8] bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="grid gap-3">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-3 rounded-lg border border-[#c7c4d8] bg-white text-sm font-medium text-[#191c1d] hover:bg-[#f3f4f5]"
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-3 rounded-lg border border-[#c7c4d8] bg-white text-sm font-medium text-[#191c1d] hover:bg-[#f3f4f5]"
            >
              <FaLinkedinIn size={18} />
              LinkedIn
            </button>
          </div>

          <div className="my-6 flex items-center gap-6">
            <div className="h-px flex-1 bg-[#c7c4d8]" />
            <span className="text-sm font-medium uppercase text-[#464555]">or</span>
            <div className="h-px flex-1 bg-[#c7c4d8]" />
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-[#ba1a1a] bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#191c1d]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none transition focus:border-[#3525cd] focus:bg-white"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label className="block text-sm font-medium text-[#191c1d]">
                  Password
                </label>
                <button type="button" className="text-sm font-medium text-[#3525cd]">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none transition focus:border-[#3525cd] focus:bg-white"
                required
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-[#191c1d]">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(event) => setKeepSignedIn(event.target.checked)}
                className="h-5 w-5 rounded border-[#c7c4d8] accent-[#3525cd]"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-[#3525cd] text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#191c1d]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#3525cd]">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-[#777587]">
          <FiShield size={18} />
          <span>Enterprise Grade Security</span>
        </div>
      </section>

      <footer className="border-t border-[#c7c4d8] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-sm text-[#464555] md:flex-row md:items-center md:justify-between">
          <p>© 2026 PortfolioPro AI. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-[#191c1d]">Privacy Policy</a>
            <a href="#" className="hover:text-[#191c1d]">Terms of Service</a>
            <a href="#" className="hover:text-[#191c1d]">Help Center</a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default SignIn;
