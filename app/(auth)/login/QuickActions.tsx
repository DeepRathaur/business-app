import { useLocale } from "@/context/LocaleContext";
import Link from "next/link";

export default function QuickActions() {
  const { t } = useLocale();
  return (
    <section>
      <div className="relative z-[1] flex h-full items-start justify-center">
        <h1 className="mt-6 text-center text-sm text-gray-700">
          New to the Ecare?
          <Link
            href="/register"
            className="ml-2 text-primary font-semibold hover:underline"
          >
            {t("USER_LOGIN.REGISTER_NOW")}
          </Link>

        </h1>
      </div>

      <div className="w-full relative md:relative vh700:absolute vh700:bottom-0 vh700:left-0 vh700:right-0 relative">
        {/* back wave */}
        <svg
          className="absolute inset-x-0 top-0 w-full"
          viewBox="0 0 390 225"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wave_back" x1="195" y1="0" x2="195" y2="225" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DB3C3B" stopOpacity="0.03" />
              <stop offset="1" stopColor="#6E1E1E" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {/* <path
                    d="M0 26.181C0 26.181 18.6376 0 54.6682 0C81.4304 0 108.194 28.481 135.915 28.481C163.637 28.481 199.463 8.915 225.546 8.915C268.623 8.915 261.721 21.291 277.585 25.054C293.449 28.817 360.087 -7.18401 389.999 11.736C389.999 38.923 389.999 225 389.999 225H0V26.181Z"
                    fill="url(#wave_back)"
                  /> */}
        </svg>

        {/* front wave */}
        <svg
          className="absolute inset-x-0 h-[100%] w-full"
          viewBox="0 0 390 225"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wave_front" x1="195" y1="0" x2="195" y2="225" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DB3C3B" stopOpacity="0.05" />
              <stop offset="1" stopColor="#6E1E1E" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M0 40C20 22 40 6 70 10c26 3 61 34 92 34 34 0 66-21 103-20 32 1 41 13 58 18 16 5 37-12 67 6V225H0V40Z"
            fill="url(#wave_front)"
          />
        </svg>


        {/* content */}
        <div className="px-6 pt-17 pb-10 relative z-10">
          <div className="mb-6 flex items-center gap-3 text-sm text-neutral-500">
            <span className="h-px flex-1 bg-neutral-300/70" />
            <span className="text-sm font-medium tracking-wide text-black">Quick Actions</span>
            <span className="h-px flex-1 bg-neutral-300/70" />
          </div>
          <button
            type="button"
            className="mt-5 btn-auth-primary"
          >
            Pay Bill
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">Need Support?</p>
        </div>

      </div>

    </section>
  );
}
