'use client';

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Tab = {
  icon: string;
  label: string;
  href?: string;
};

const tabs: Tab[] = [
  { icon: '/images/icons/home-menu.svg', label: 'Home', href: '/dashboard' },
  { icon: '/images/icons/Paybill_payments.svg', label: 'Pay Bill', href: '/billing' },
  { icon: '/images/icons/buy-airtime-menu.svg', label: 'Buy Airtime', href: '/buy-airtime' },
  { icon: '/images/icons/accounts-menu.svg', label: 'Accounts', href: '/accounts-overview' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (tab: Tab) => {
    if (!tab.href) return;
    if (pathname === tab.href) return;
    router.push(tab.href);
  };

  return (
<nav className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[420px] -translate-x-1/2 justify-around border-t border-slate-200 bg-white py-1.5">
  {tabs.map((tab) => {
    const isActive = tab.href ? pathname === tab.href : false;

    return (
      <motion.button
        key={tab.label}
        type="button"
        onClick={() => handleNavigate(tab)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`flex flex-1 items-center justify-center text-[10px] ${
          isActive ? "text-red-500" : "font-color-text"
        }`}
      >
        {/* Wrapper keeps icon + label aligned and same height */}
        <div className="flex flex-col items-center justify-between min-h-[56px]">
          {/* Icon pill background when active */}
          <div
            className={`mb-1 flex h-9 w-14 items-center justify-center rounded-full ${
              isActive ? "bg-[#FDEDED]" : "bg-transparent"
            }`}
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={20}
              height={20}
              className={`h-5 w-5 object-contain ${
                isActive ? "saturate-100" : ""
              }`}
            />
          </div>

          {/* Label */}
          <span className="leading-none text-xs font-medium">
            {tab.label}
          </span>
        </div>

            
      {isActive && (
          <motion.div
            layoutId="bottom-nav-indicator"
            className="absolute bottom-0 h-[3px] w-10 bg-red-500 rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}

      </motion.button>
    );
  })}
</nav>
  );
}