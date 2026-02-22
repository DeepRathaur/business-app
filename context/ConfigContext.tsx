"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getGlobalConfig } from "@/core/config/globalConfig";
import { ConfigurationService } from "@/core/services/ConfigurationService";
import type { ValidationModel } from "@/shared/models";

/** OPCO config shape - from config?.result?.public?.OPCO_CONFIG */
export interface OpcoConfig {
  ENABLE_UMS_2?: boolean;
  ENCRYPTION?: boolean;
  OTP_EXPIRY_TIME?: number;
  VALIDATIONS?: ValidationModel;
}

/** Pattern config - from config?.result?.public?.PATTERN */
export interface PatternConfig {
  VALID_EMAIL?: string;
  VALID_PASSWORD?: string;
}

export interface ConfigContextValue {
  config: unknown;
  loading: boolean;
  error: unknown;
  opcoConfig: OpcoConfig;
  pattern: PatternConfig;
  validation: ValidationModel;
  isEncrypted: boolean;
  isEnableUms2: boolean;
  otpLength: number;
  otpExpiryMinutes: number;
  emailPattern: RegExp;
}

const DEFAULT_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const ConfigContext = createContext<ConfigContextValue | null>(null);

const DEFAULT_VALIDATION: ValidationModel = { otpMaxlength: 6 };

function deriveFromConfig(config: unknown): {
  opcoConfig: OpcoConfig;
  pattern: PatternConfig;
  validation: ValidationModel;
} {
  const global = getGlobalConfig();
  const public_ = (config as { result?: { public?: Record<string, unknown> } })?.result?.public;
  const opcoRaw = public_?.OPCO_CONFIG as OpcoConfig | undefined;
  const patternRaw = public_?.PATTERN as PatternConfig | undefined;

  const validation: ValidationModel = (opcoRaw?.VALIDATIONS as ValidationModel) ?? DEFAULT_VALIDATION;
  const opcoConfig: OpcoConfig = {
    ENABLE_UMS_2: opcoRaw?.ENABLE_UMS_2 ?? global.enableUms2,
    ENCRYPTION: opcoRaw?.ENCRYPTION ?? global.encryption,
    OTP_EXPIRY_TIME: opcoRaw?.OTP_EXPIRY_TIME ?? 1,
    VALIDATIONS: validation,
  };
  const pattern: PatternConfig = {
    VALID_EMAIL: patternRaw?.VALID_EMAIL,
    VALID_PASSWORD: patternRaw?.VALID_PASSWORD,
  };
  return { opcoConfig, pattern, validation };
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<unknown>(null);
  const [loading, setLoading] = useState(false); // Start false: fetch in background, don't block UI
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const service = new ConfigurationService();
      service
        .fetchConfiguration("ENT_MOBILE_PORTAL", "public")
        .then((data) => {
          setConfig(data);
          setError(null);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const configValue = useMemo(() => {
    const global = getGlobalConfig();
    const { opcoConfig, pattern, validation } = config ? deriveFromConfig(config) : deriveFromConfig({});
    const emailPattern = pattern.VALID_EMAIL
      ? new RegExp(pattern.VALID_EMAIL)
      : DEFAULT_EMAIL_REGEX;
    return {
      config,
      loading,
      error,
      opcoConfig,
      pattern,
      validation,
      isEncrypted: opcoConfig.ENCRYPTION ?? global.encryption,
      isEnableUms2: opcoConfig.ENABLE_UMS_2 ?? global.enableUms2,
      otpLength: validation.otpMaxlength ?? 6,
      otpExpiryMinutes: opcoConfig.OTP_EXPIRY_TIME ?? 1,
      emailPattern,
    };
  }, [config, loading, error]);

  return (
    <ConfigContext.Provider value={configValue}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  const global = getGlobalConfig();
  if (!ctx) {
    return {
      config: null,
      loading: false,
      error: null,
      opcoConfig: {},
      pattern: {},
      validation: DEFAULT_VALIDATION,
      isEncrypted: global.encryption,
      isEnableUms2: global.enableUms2,
      otpLength: 6,
      otpExpiryMinutes: 1,
      emailPattern: DEFAULT_EMAIL_REGEX,
    };
  }
  return ctx;
}
