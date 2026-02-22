/**
 * Utility - Class name merger (for conditional styles)
 * Use with Tailwind
 */

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
