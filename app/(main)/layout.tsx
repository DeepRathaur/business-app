"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import MobileContainer from "@/components/ui/MobileContainer";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import BottomNav from "@/components/layout/BottomNav";
import { AuthGuard } from "@/components/auth/AuthGuard";

/**
 * Main Layout - Post-login app shell (protected)
 * AuthGuard redirects unauthenticated users to /login
 * Bottom nav on Dashboard, Manage Users, Services
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBottomNav =
    pathname === "/dashboard" || pathname === "/manage-users" || pathname === "/services";

  return (
    <AuthGuard>
      <MobileContainer scroll>
        <SafeAreaWrapper>
          <div
            className={`flex flex-col min-h-[100dvh] bg-primary text-white ${showBottomNav ? "pb-20" : ""}`}
          >
            {children}
          </div>
          {showBottomNav && <BottomNav />}
        </SafeAreaWrapper>
      </MobileContainer>
    </AuthGuard>
  );
}
