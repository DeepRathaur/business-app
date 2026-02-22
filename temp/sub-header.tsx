'use client';

import { LocaleContext } from '@/context/LocaleContext';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useLayout } from '@/context/LayoutContext';

export default function SubHeader() {
  const { selectedLang, setSelectedLang } = useContext(LocaleContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ['en', 'fr'];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const { hideHeader } = useLayout();
  const selectLang = (lang: string) => {

    console.log('Language changed to:', lang);

    setSelectedLang(lang);
    setDropdownOpen(false);
  };



  return (
    <>
      {!hideHeader &&
        <div className="w-full px-[15px] py-[12px] flex items-center justify-between">
          {/* Support */}
          <div className="flex items-center space-x-1">
            <Image src="/images/icons/help-circle.svg" alt="Support" width={18} height={18} />
            <a href="/support"><span className=" text-black text-sm ml-[3px]">Support</span></a>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 ml-2">
            <Image src="/images/icons/Icon ionic-md-globe.svg" alt="Language" width={15} height={15} />
            <button
              onClick={toggleDropdown}
              className="flex items-center text-sm text-black focus:outline-none"
            >
              {selectedLang.toUpperCase()}
              <Image
                src="/images/icons/down-arrow.svg"
                alt="Dropdown"
                width={20}
                height={20}
                className="ml-1"
              />
            </button>
          </div>
        </div>
      }
      {/* Bottom Sheet Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 flex items-end justify-center bg-custom-overlay bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDropdownOpen(false)} // tap outside to close
          >

            {/* Bottom Sheet */}
            <motion.div
              key="sheet"
              onClick={(e) => e.stopPropagation()} // prevent closing when tapping inside
              className="w-full bg-white rounded-t-[18px] shadow-lg p-4"
              initial={{
                y: "100%",
                opacity: 0,
                backgroundColor: "rgba(255,255,255,0)"
              }}
              animate={{
                y: 0,
                opacity: 1,
                backgroundColor: "rgba(255,255,255,1)"
              }}
              exit={{
                y: "100%",
                opacity: 0,
                backgroundColor: "rgba(255,255,255,0)"
              }}
              transition={{
                y: {
                  type: "spring",
                  stiffness: 380,
                  damping: 28,
                },
                opacity: { duration: 0.2 },
                backgroundColor: { duration: 0.25 }
              }}
            // animate={{ y: 0 }}
            // exit={{ y: "100%" }}
            // transition={{
            //   type: "spring",
            //   stiffness: 380,
            //   damping: 28,
            // }}
            >
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Change Language
              </h3>

              {/* Language Options */}
              <div className="flex flex-col space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLang(lang)}
                    className={`text-sm py-2 rounded flex items-center space-x-2 ${selectedLang === lang
                        ? " text-red-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center leading-none">
                      {selectedLang === lang && (
                        <Image
                            src="/images/icons/Check-mark.svg"
                            alt="Language"
                            decoding="async" data-nimg="1"
                            loading="lazy"
                            width={20}
                            height={20}
                          />
                      )}
                    </span>
                    <span>{lang.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
