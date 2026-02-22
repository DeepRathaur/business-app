"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import FormInput from "@/components/forms/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Reset Password - Set new password (after clicking email link)
 * In real app, would validate token from URL
 */
export default function ResetPasswordPage() {
  const router = useRouter();
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
    router.push("/login");
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="New Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Reset Password
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
