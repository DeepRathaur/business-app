'use client';

import Image from "next/image";
import Link from "next/link";
import BackToLogin from "./back-to-login/BackToLogin";
import MenuDrawer from "./MenuDrawer";
import { useState } from "react";
import { useLayout } from "@/context/LayoutContext";

interface HeaderProps {
  showFullHeader?: boolean;
  isLoggedIn?: boolean;
}

export default function Header({ showFullHeader = true, isLoggedIn = false }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { hideHeader } = useLayout();

  return (
    <>
      {isLoggedIn ? (
        <>
          <header
            className={`flex items-center justify-between  bg-white py-[10px] px-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] `}>
            {/* Left Section: Menu + Logo */}
            <div className="flex items-center space-x-3">
              <>
                <button onClick={() => setIsDrawerOpen(true)}>
                  <Image src="/images/icons/menu.svg" alt="Menu" width={24} height={24} />
                </button>
              </>
            </div>
            {/* Optional Full Header Content */}
            {/* {showFullHeader && <BackToLogin />} */}
          </header>
        </>

      ) : (
        <>
        {!hideHeader &&( <header
            className={`flex items-center justify-center`}>

              <Image
                src="/images/abc-logo.svg"
                alt="Business Logo"
                width={98}
                height={87}
              />
            </header>
          )}
        </>
      )}
      {isLoggedIn && <MenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />}


    </>
  );
}
