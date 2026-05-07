"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../AuthContext";

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-stretch">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-26 py-17.5 text-center">
            <Link className="mb-8 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.svg"
                alt="PortfolioPro"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src="/images/logo/logo-dark.svg"
                alt="PortfolioPro"
                width={176}
                height={32}
              />
            </Link>
            <Image
              src="/images/illustration/illustration-03.svg"
              alt="Portfolio setup"
              width={360}
              height={360}
              priority
            />
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign Up to PortfolioPro
            </h2>

            {error && (
              <div className="mb-5 rounded-md border border-red bg-red/10 px-4 py-3 text-sm text-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Re-type Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>

              <div className="mt-6 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
