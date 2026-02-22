"use client";

import Image from "next/image";

/** CSS-only language picker bottom sheet - no framer-motion on login bundle */
export function LanguageSheet({
  open,
  onClose,
  currentLanguage,
  changeLanguage,
  languages,
}: {
  open: boolean;
  onClose: () => void;
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  languages: string[];
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[18px] shadow-lg p-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Change Language</h3>
        <div className="flex flex-col space-y-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                changeLanguage(lang);
                onClose();
              }}
              className={`text-sm py-2 rounded flex items-center space-x-2 ${
                currentLanguage === lang
                  ? " text-red-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center">
                {currentLanguage === lang && (
                  <Image
                    src="/images/icons/Check-mark.svg"
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                )}
              </span>
              <span>{lang.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
