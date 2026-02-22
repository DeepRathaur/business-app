"use client";

import { useEffect, type ReactNode } from "react";
import { configureStatusBar } from "@/plugins/capacitor";
import { AccountProvider } from "@/context/AccountContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppBootstrap } from "@/components/layout/AppBootstrap";
import { RegisterServiceWorker } from "./RegisterServiceWorker";

/**
 * Single client boundary for all providers.
 * Root layout stays a Server Component; only this tree is hydrated.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    configureStatusBar();
  }, []);

  return (
    <>
      <RegisterServiceWorker />
    <ConfigProvider>
      <LocaleProvider>
        <LayoutProvider>
          <AuthProvider>
            <AccountProvider>
              <ServiceProvider>
                <ToastProvider>
                  {/* <AppBootstrap> */}
                    <div className="h-full min-h-[100dvh] flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                      {children}
                    </div>
                  {/* </AppBootstrap> */}
                </ToastProvider>
              </ServiceProvider>
            </AccountProvider>
          </AuthProvider>
        </LayoutProvider>
      </LocaleProvider>
    </ConfigProvider>
    </>
  );
}
