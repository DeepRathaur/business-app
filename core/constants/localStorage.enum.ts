/**
 * LocalStorage keys - Centralized enum. No magic strings.
 */

export enum LocalStorageKey {
  /** Access token for authenticated API calls */
  ACCESS_TOKEN = "ACCESS_LITE_TOK_EN",
  /** Selected language code (e.g., en, fr) */
  LANGUAGE = "app_language",
  /** Account number for default selection */
  ACCOUNT_NO = "ACCOUNT_NO",
  /** User object */
  USER = "USER",
  /** Login timestamp */
  LOGIN_TIME = "LOGIN_TIME",
  /** Feature flags / layout config - extend as needed */
  LAYOUT_CONF = "LAYOUT_CONF",
  /** User email / auuid for fetch-permission */
  AUU_NUMBERID = "AUU_NUMBERID",
  /** User permissions */
  UMS_PERMISSION = "UMS_PERMISSION",
  /** Service type */
  SERVICE_TYPE = "SERVICE_TYPE",
  /** Enterprise role */
  ENTERPRISE_ROLE = "ENTERPRISE_ROLE",
  /** Transaction info for pay flow (outstanding amount, invoice, etc.) */
  TXN_INFO = "TXN_INFO",
}
