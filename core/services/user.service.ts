/**
 * User Service - Fetch user details and UMS permissions
 * Used by fetch-permission flow after OTP verify success.
 */

import axiosClient from "@/core/api/axiosClient";
import { getFullUrl } from "@/core/api/config";
import { UserUrls_extended } from "@/core/constants/api-urls";

export interface FetchUserResponse {
  statusCode?: string;
  result?: {
    email?: string;
    userPermissions?: unknown[];
    serviceType?: string[];
    userType?: string;
    [key: string]: unknown;
  };
  message?: string;
}

export interface UMSDetailsResponse {
  statusCode?: string;
  result?: {
    authorities?: { authority: string }[];
    role?: { roleName: string; permissions?: { permissionName: string; enabled: boolean }[] }[];
    [key: string]: unknown;
  };
}

export async function getUserDetails(isUms2: boolean): Promise<FetchUserResponse> {
  const path = isUms2
    ? UserUrls_extended.FETCH_USER_V2
    : UserUrls_extended.FETCH_USER;
  const url = getFullUrl(path);
  const res = await axiosClient.post<FetchUserResponse>(url, {});
  return res.data;
}

export async function getUMSPermission(isUms2: boolean): Promise<UMSDetailsResponse> {
  const path = isUms2
    ? UserUrls_extended.UMS2_FETCH_UMS_DETAILS
    : UserUrls_extended.FETCH_UMS_DETAILS;
  const url = getFullUrl(path);
  const res = await axiosClient.get<UMSDetailsResponse>(url);
  return res.data;
}
