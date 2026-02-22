import { Inter } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root Layout - Server Component
 * Keeps font and HTML structure out of the client bundle.
 * All context and client logic live in ClientProviders.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${inter.className} min-h-[100dvh] h-full bg-neutral-100 text-neutral-900 antialiased select-none touch-none overflow-hidden`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
