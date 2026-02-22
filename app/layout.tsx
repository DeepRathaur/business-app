"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import { configureStatusBar } from "@/plugins/capacitor";
import { AuthProvider } from "@/context/AuthContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root Layout - Base HTML structure
 * AuthProvider: token storage + AuthInterceptor registration
 * StatusBar configured via Capacitor plugin (SSR-safe)
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
        <LocaleProvider>
          <AuthProvider>
            <ToastProvider>
              {/* Safe-area insets for notch/home indicator */}
          <div className="h-full min-h-[100dvh] flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
            </ToastProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}