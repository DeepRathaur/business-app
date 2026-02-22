import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /** Design tokens - Figma-first system */
      colors: {
        airtel: "#E40000",
        primary: {
          DEFAULT: "#E40000",
          light: "#FF1A1A",
          dark: "#B30000",
        },
        charcoal: "#1e293b",
      },
      spacing: {
        // 4px/8px grid
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        elevated: "0 8px 24px rgba(0,0,0,0.12)",
      },
      /** Safe area utilities for notch/iPhone */
      padding: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-left": "env(safe-area-inset-left, 0px)",
        "safe-right": "env(safe-area-inset-right, 0px)",
      },
      minHeight: {
        screen: "100dvh", // Dynamic viewport - handles mobile browser chrome
      },
    },
  },
  plugins: [],
};

export default config;
