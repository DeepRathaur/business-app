/**
 * Pagination utilities
 */

export function calculateOffset(page: number, itemsPerPage: number): number {
  return (page - 1) * itemsPerPage;
}
