"use client";

import { type ReactNode } from "react";
import MobileContainer from "@/components/ui/MobileContainer";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

/**
 * AuthLayout - Consistent layout for auth screens (login, register, etc.)
 * Full height, centered content, scrollable for keyboard/form overflow
 */
interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <MobileContainer scroll>
      <SafeAreaWrapper>
        <PageTransitionWrapper>
          <div className="flex flex-col min-h-[100dvh] bg-primary px-5 py-8">
            {(title || subtitle) && (
              <div className="text-center mb-8">
                {title && (
                  <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-base text-white/80">{subtitle}</p>
                )}
              </div>
            )}
            <div className="flex-1 flex flex-col gap-6">{children}</div>
          </div>
        </PageTransitionWrapper>
      </SafeAreaWrapper>
    </MobileContainer>
  );
}
