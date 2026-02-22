"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import { configureStatusBar } from "@/plugins/capacitor";
import { AccountProvider } from "@/context/AccountContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppBootstrap } from "@/components/layout/AppBootstrap";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root Layout - Base HTML structure
 * App load sequence: Config first → Locale (LocaleProvider waits for Config)
 * AppBootstrap: shows skeleton until config + locale ready
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    configureStatusBar();
  }, []);

  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${inter.className} min-h-[100dvh] h-full bg-neutral-100 text-neutral-900 antialiased select-none touch-none overflow-hidden`}
      >
        <ConfigProvider>
          <LocaleProvider>
            <LayoutProvider>
              <AuthProvider>
                <AccountProvider>
                <ServiceProvider>
                <ToastProvider>
                  <AppBootstrap>
                    <div className="h-full min-h-[100dvh] flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                      {children}
                    </div>
                  </AppBootstrap>
                </ToastProvider>
                </ServiceProvider>
                </AccountProvider>
              </AuthProvider>
            </LayoutProvider>
          </LocaleProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}