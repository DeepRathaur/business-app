/**
 * Dashboard Module - Dashboard data service
 * Fetch summary data. Swap for real API
 */

export type DashboardSummary = {
  activeLines: number;
  dataBalanceGB: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // TODO: Fetch from API
  return {
    activeLines: 12,
    dataBalanceGB: 24.5,
  };
}
