/**
 * Date formatting utilities
 */

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "--";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "--";
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "--";
  }
}
