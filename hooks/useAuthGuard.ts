"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { accountService } from "@/core/services/account.service";

const PROTECTED_PATHS = [
  "/dashboard",
  "/manage-users",
  "/services",
  "/line-details",
  "/account",
  "/paybill",
  "/support",
];
/**
 * useAuthGuard - Client-side auth protection for (main) routes.
 * Since output: 'export' disables middleware, we use this hook.
 * Redirects unauthenticated users from protected paths to /login.
 */
export function useAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = accountService.isUserLoggedIn();
    setIsAuthenticated(loggedIn);

    const isProtected = PROTECTED_PATHS.some((p) => pathname?.startsWith(p));
    if (isProtected && !loggedIn) {
      router.replace("/login");
      return;
    }

    setIsChecking(false);
  }, [pathname, router]);

  return { isAuthenticated, isChecking };
}
