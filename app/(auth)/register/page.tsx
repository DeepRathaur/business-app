"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import FormInput from "@/components/forms/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AnimatedLogo from "@/components/animations/AnimatedLogo";

/**
 * Register Page - New user registration
 */
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register for Airtel Business Care"
    >
      <div className="flex justify-center mb-6">
        <AnimatedLogo size="sm" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Min 8 characters"
          required
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={password !== confirmPassword && confirmPassword ? "Passwords do not match" : undefined}
          required
        />
        {error && <p className="text-red-200 text-sm">{error}</p>}
        <PrimaryButton type="submit" loading={loading}>
          Create Account
        </PrimaryButton>
      </form>
      <p className="text-center text-sm text-white/80 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-white font-semibold underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
