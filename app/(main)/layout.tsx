"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import MobileContainer from "@/components/ui/MobileContainer";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import BottomNav from "@/components/layout/BottomNav";

/**
 * Main Layout - Post-login app shell
 * Bottom nav only on Dashboard and Manage Users
 * Support/Pay Bill accessible from auth flow - no nav
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBottomNav =
    pathname === "/dashboard" || pathname === "/manage-users";

  return (
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
  );
}
