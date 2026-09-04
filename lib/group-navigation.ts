export function getInitialGroupFromSearch(search: string): string {
  return new URLSearchParams(search).get("group") || "all";
}
