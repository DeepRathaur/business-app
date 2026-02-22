"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/context/ConfigContext";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";
import { accountService } from "@/core/services/account.service";
import { getUserDetails, getUMSPermission } from "@/core/services/user.service";

/**
 * useFetchPermission - Runs after OTP verify success
 * Calls getUserDetails + getUMSPermission, waits until ALL resolve.
 * Navigate to dashboard when all succeed; logout + redirect on failure.
 */
export function useFetchPermission() {
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useLocale();
  const config = useConfig();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runFetchPermission = useCallback(async () => {
    const publicConfig = (config.config as { result?: { public?: Record<string, unknown> } })?.result?.public;
    const opcoConfig = publicConfig?.OPCO_CONFIG as { ENABLE_UMS_2?: boolean } | undefined;
    const isUms2 = opcoConfig?.ENABLE_UMS_2 ?? config.isEnableUms2 ?? false;

    setLoading(true);
    setError(null);

    try {
      const [userRes, umsRes] = await Promise.all([
        getUserDetails(isUms2),
        getUMSPermission(isUms2),
      ]);

      if (userRes.statusCode !== "SUCCESS") {
        const msg = (userRes as { message?: string }).message ?? t("message_constant.SOMETHING_WENT_WRONG");
        throw new Error(msg);
      }

      const userResult = userRes.result;
      if (userResult?.email) {
        accountService.setAuuid(userResult.email);
      }
      accountService.setUser(userResult ?? {});
      accountService.setPermission(userResult?.userPermissions ?? []);
      accountService.setServiceType(userResult?.serviceType ?? []);
      if (userResult?.userType) {
        accountService.setEnterPriseRole(String(userResult.userType));
      }

      if (umsRes.statusCode === "SUCCESS" && umsRes.result) {
        if (isUms2 && umsRes.result.authorities) {
          const names = umsRes.result.authorities.map((a) => a.authority);
          accountService.setUMSPermission(names);
        } else if (!isUms2 && umsRes.result.role) {
          const perms: string[] = [];
          for (const role of umsRes.result.role) {
            if (role.permissions) {
              for (const p of role.permissions) {
                if (p.enabled && p.permissionName) perms.push(p.permissionName);
              }
            }
          }
          accountService.setUMSPermission([...new Set(perms)]);
        }
      }

      window.dispatchEvent(new Event("auth-changed"));

      const hasPermissions = Array.isArray(userResult?.userPermissions) && userResult.userPermissions.length > 0;
      if (hasPermissions) {
        router.replace("/dashboard");
      } else {
        accountService.logout();
        router.replace("/login");
        showToast(t("message_constant.SOMETHING_WENT_WRONG"), "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("message_constant.SOMETHING_WENT_WRONG");
      setError(msg);
      accountService.logout();
      router.replace("/login");
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [config.config, config.isEnableUms2, router, showToast, t]);

  useEffect(() => {
    runFetchPermission();
  }, [runFetchPermission]);

  return { loading, error };
}
