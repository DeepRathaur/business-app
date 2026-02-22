"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { ServiceCategoryEnum } from "@/shared/enum";

type ServiceType = ServiceCategoryEnum | string | null;

interface ServiceContextValue {
  service: ServiceType;
  setService: (s: ServiceType) => void;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [service, setServiceState] = useState<ServiceType>(null);

  const setService = useCallback((s: ServiceType) => {
    setServiceState(s);
  }, []);

  const value = useMemo(() => ({ service, setService }), [service, setService]);

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
}

export function useServiceContext(): ServiceContextValue {
  const ctx = useContext(ServiceContext);
  if (!ctx) {
    throw new Error(
      "useServiceContext must be used within ServiceProvider (wrap app with ServiceProvider)."
    );
  }
  return ctx;
}
