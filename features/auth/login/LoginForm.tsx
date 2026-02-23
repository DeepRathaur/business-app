"use client";

import Link from "next/link";
import FormInput from "@/components/forms/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLocale } from "@/context/LocaleContext";
import type { LoginFormErrors } from "./useLoginFlow";

interface LoginFormProps {
  email: string;
  password: string;
  errors: LoginFormErrors;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

/**
 * LoginForm - Credentials step (email + password)
 * Uses t() for all strings. No hardcoded copy.
 */
export default function LoginForm({
  email,
  password,
  errors,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const { t } = useLocale();

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-neutral-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-5"
        aria-label={t("USER_REGISTRATION.EMAILID")}
      >
        <FormInput
          label={t("USER_REGISTRATION.EMAILID")}
          theme="light"
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={errors.email}
          required
        />
        <FormInput
          label={t("USER_LOGIN.PASSWORD")}
          theme="light"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          showPasswordToggle
          error={errors.password}
          required
        />
        <Link
          href="/forgot-password"
          className="text-right text-xs text-[#2286FF]"
        >
          <span className="text-right w-full block">
                {t("USER_LOGIN.FORGOT_PASSWORD")}
          </span>
          
        </Link>
        <PrimaryButton
          type="submit"
          loading={loading}
          className="btn-auth-primary"
        >
          {t("BUTTONS.VALIDATE_GET_OTP")}
        </PrimaryButton>
      </form>
    </div>
  );
}