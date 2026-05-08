"use client";

import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye } from "react-icons/fi";
import { useSignUpForm } from "@/hooks/useAuthForms";

const SignUp = () => {
  const {
    email,
    error,
    isSubmitting,
    name,
    password,
    setEmail,
    setName,
    setPassword,
    handleSubmit,
  } = useSignUpForm();

  return (
    <main className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#191c1d]">
      <header className="border-b border-[#c7c4d8] bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold text-[#3525cd]">
            PortfolioPro
          </Link>
          <p className="text-sm text-[#464555]">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-[#3525cd]">
              Log In
            </Link>
          </p>
        </div>
      </header>

      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute left-16 top-36 h-80 w-80 rounded-full bg-[#c3c0ff] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-12 bottom-40 h-80 w-80 rounded-full bg-[#ffb695] opacity-35 blur-3xl" />

        <div className="relative w-full max-w-lg rounded-lg border border-[#c7c4d8] bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#191c1d]">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-[#464555]">
              Join the community of elite professionals.
            </p>
          </div>

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
              <label className="mb-2 block text-sm font-medium text-[#464555]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none transition focus:border-[#3525cd] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#464555]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
                className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none transition focus:border-[#3525cd] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#464555]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-[#f8f9fa] px-4 pr-12 text-sm text-[#191c1d] outline-none transition focus:border-[#3525cd] focus:bg-white"
                  minLength={8}
                  required
                />
                <FiEye
                  size={18}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#464555]"
                />
              </div>
              <p className="mt-2 text-sm text-[#464555]">
                Must be at least 8 characters long.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-[#3525cd] text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-8 text-[#464555]">
            By clicking &quot;Create Account&quot;, you agree to our{" "}
            <a href="#" className="underline underline-offset-4">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#c7c4d8] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-sm text-[#464555] md:flex-row md:items-center md:justify-between">
          <p>© 2026 PortfolioPro AI. All rights reserved.</p>
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
};

export default SignUp;
