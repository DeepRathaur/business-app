"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

interface LayoutContextValue {
  hideHeader: boolean;
  setHideHeader: (hide: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [hideHeader, setHideHeaderState] = useState(false);

  const setHideHeader = useCallback((hide: boolean) => {
    setHideHeaderState(hide);
  }, []);

  const value = useMemo(
    () => ({ hideHeader, setHideHeader }),
    [hideHeader, setHideHeader]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    return {
      hideHeader: false,
      setHideHeader: () => {},
    };
  }
  return ctx;
}
