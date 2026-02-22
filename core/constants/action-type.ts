/**
 * Dashboard action types - Billing widget, banners, etc.
 */

export const actionType = {
  PAY_TOTAL_OUTSTANDING: "PAY_TOTAL_OUTSTANDING",
  BILLING_PAGE: "BILLING_PAGE",
} as const;

export type ActionType = (typeof actionType)[keyof typeof actionType];
