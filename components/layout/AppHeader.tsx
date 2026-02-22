"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * AppHeader - Main app header for post-login screens
 * Back button: use backHref for link, or useRouterBack for history.back()
 */
interface AppHeaderProps {
  title: string;
  /** Back button links to this path */
  backHref?: string;
  /** Use router.back() instead of link (for Support/PayBill from login) */
  useRouterBack?: boolean;
  /** Optional right-side action */
  rightAction?: React.ReactNode;
}

export default function AppHeader({
  title,
  backHref,
  useRouterBack,
  rightAction,
}: AppHeaderProps) {
  const router = useRouter();
  const showBack = backHref ?? useRouterBack;

  return (
    <header className="flex items-center justify-between h-14 px-4 shrink-0">
      <div className="flex items-center min-w-0 flex-1">
        {showBack ? (
          useRouterBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <Link
              href={backHref!}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )
        ) : (
          <div className="w-10" />
        )}
        <h1 className="flex-1 text-lg font-semibold text-white text-center truncate mx-2">
          {title}
        </h1>
        <div className="flex items-center justify-end w-10 min-w-[40px]">
          {rightAction ?? <div />}
        </div>
      </div>
    </header>
  );
}
