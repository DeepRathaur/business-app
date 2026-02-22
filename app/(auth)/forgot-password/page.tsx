"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import FormInput from "@/components/forms/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Forgot Password - Request password reset
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We've sent a reset link to ${email}`}
      >
        <div className="flex flex-col gap-6">
          <p className="text-white/80 text-center">
            Click the link in the email to reset your password. The link expires in 1 hour.
          </p>
          <Link href="/login">
            <PrimaryButton fullWidth>Back to Sign In</PrimaryButton>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PrimaryButton type="submit" loading={loading}>
          Send Reset Link
        </PrimaryButton>
      </form>
      <Link
        href="/login"
        className="text-center text-sm text-white/80 hover:text-white mt-6"
      >
        Back to Sign In
      </Link>
    </AuthLayout>
  );
}
