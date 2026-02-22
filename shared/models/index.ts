/**
 * Shared models - Response types for API
 */

/** App configuration from database - config API response */
export interface ResponseAppConfiguration {
  statusCode?: string;
  result?: {
    public?: Record<string, unknown>;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

/** Validation rules from config.result.public.OPCO_CONFIG.VALIDATIONS */
export interface ValidationModel {
  otpMaxlength?: number;
  passwordMinLength?: number;
  passwordMaxLength?: number;
  [key: string]: unknown;
}

/** Pattern regexes from config.result.public.PATTERN */
export interface PatternModel {
  VALID_EMAIL?: string;
  VALID_PASSWORD?: string;
  [key: string]: unknown;
}

/** Bill summary request */
export interface GetBillSummaryModel {
  accountNo: string;
  currentPage?: string;
  [key: string]: unknown;
}

/** Bill summary API response */
export interface BillSummaryResponseModel {
  statusCode?: string;
  result?: GetBillSummaryModel & {
    totalOutstandingAmount?: number;
    totalOverdueAmount?: number;
    dueDate?: string;
    invoiceNo?: string;
    currency?: string;
  };
  message?: string;
}

/** Banner item for carousel */
export interface BannerModel {
  name?: string;
  imageUri?: string;
  link?: string;
  accountName?: string;
  accountNo?: string;
}

/** Banner configuration API response */
export interface BannerResponseModel {
  statusCode?: string;
  result?: BannerModel[];
  message?: string;
}

/** Transaction info for pay flow */
export interface TransactionInfoModel {
  accountNo?: string;
  invoiceNo?: string;
  outstandingAmount?: number;
  overdueAmount?: number;
  dueDate?: string;
  clientName?: string;
  currency?: string;
  amount?: string;
  mode?: string;
  mobileNumber?: string;
  serviceName?: string;
  transactionType?: string;
  countryCode?: string;
}

/** Account details for AccountContext */
export interface AccountDetailsModel {
  accountNo: string;
  accountName?: string;
  contactPersonMsisdn?: string;
  [key: string]: unknown;
}

/** Account details API response */
export interface AccountDetailsResponseModel {
  statusCode?: string;
  result?: {
    ecareaccounts?: AccountDetailsModel[];
    accounts?: AccountDetailsModel[];
    [key: string]: unknown;
  };
  message?: string;
}

/** Line details (msisdn, status, lineType) */
export interface LineDetailsModel {
  msisdn?: string;
  status?: string;
  lineType?: string;
  [key: string]: unknown;
}

/** Get line details request */
export interface GetLineDetailsModel {
  accountNo: string;
  contactPersonEmailId?: string;
  contactPersonMsisdn?: string;
  offset?: number;
  limit?: number;
  showVIP?: boolean;
  serviceTypes?: string[];
  lineStatus?: string;
  lineType?: string;
  [key: string]: unknown;
}

/** Line details API response */
export interface LineDetailsResponseModel {
  statusCode?: string;
  result?: {
    lines?: LineDetailsModel[];
    totalRecords?: number;
    [key: string]: unknown;
  };
  message?: string;
}

/** Line count item */
export interface LineCountListDataModel {
  lines?: { count?: number }[];
  serviceType?: string;
}

/** Get line count request */
export interface GetLineCountModel {
  accountNo: string;
  contactPersonEmailId?: string;
  contactPersonMsisdn?: string;
  serviceTypes?: string[];
  showVIP?: boolean;
  auuid?: string;
  parentDTO?: { parentEmailId?: string; parentMsisdn?: string };
  [key: string]: unknown;
}

/** Line count API response */
export interface LineCountResponseModel {
  statusCode?: string;
  result?: {
    services?: LineCountListDataModel[];
    [key: string]: unknown;
  };
  message?: string;
}
