/**
 * Analytics Plugin - Event tracking
 * Replace with real analytics (GA4, Mixpanel, etc.)
 * Designed for future extension - plug-and-play
 */

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export async function track(event: AnalyticsEvent): Promise<void> {
  // SSR-safe: only run on client
  if (typeof window === "undefined") return;
  console.debug("[Analytics]", event.name, event.properties ?? {});
  // TODO: Integrate with analytics provider
}

export async function trackPageView(path: string): Promise<void> {
  await track({ name: "page_view", properties: { path } });
}
