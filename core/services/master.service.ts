/**
 * Master Service - Bill summary, banner, account details
 * Used by dashboard components.
 */

import axiosClient from "@/core/api/axiosClient";
import { getFullUrl } from "@/core/api/config";
import { MasterDataUrls } from "@/core/constants/api-urls";
import type {
  AccountDetailsResponseModel,
  BillSummaryResponseModel,
  BannerResponseModel,
  GetBillSummaryModel,
  GetLineDetailsModel,
  LineDetailsResponseModel,
  GetLineCountModel,
  LineCountResponseModel,
} from "@/shared/models";

export async function loadBillSummary(
  input: GetBillSummaryModel
): Promise<BillSummaryResponseModel> {
  const url = getFullUrl(MasterDataUrls.GET_BILL_SUMMARY);
  const res = await axiosClient.post<BillSummaryResponseModel>(url, input);
  return res.data;
}

export async function getBannerConfiguration(): Promise<BannerResponseModel> {
  const url = getFullUrl(MasterDataUrls.GET_BANNER_CONFIGURATION);
  const res = await axiosClient.post<BannerResponseModel>(url, {});
  return res.data;
}

export async function loadAccountDetails(input: {
  email?: string;
  [key: string]: unknown;
}): Promise<AccountDetailsResponseModel> {
  const url = getFullUrl(MasterDataUrls.GET_ACCOUNT_DETAILS);
  const res = await axiosClient.post<AccountDetailsResponseModel>(url, input);
  return res.data;
}

export async function getAllLines(
  input: GetLineDetailsModel
): Promise<LineDetailsResponseModel> {
  const url = getFullUrl(MasterDataUrls.GET_LINE_DETAILS);
  const res = await axiosClient.post<LineDetailsResponseModel>(url, input);
  return res.data;
}

export async function getLineTypeCount(
  input: GetLineCountModel
): Promise<LineCountResponseModel> {
  const url = getFullUrl(MasterDataUrls.GET_LINE_COUNT);
  const res = await axiosClient.post<LineCountResponseModel>(url, input);
  return res.data;
}
