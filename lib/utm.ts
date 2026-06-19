export const DEFAULT_UTM_SOURCE = "direct";

export function resolveUTMSource(source?: string | null) {
  const normalizedSource = source?.trim();

  return normalizedSource ? normalizedSource : DEFAULT_UTM_SOURCE;
}

export function getUTMSource() {
  if (typeof window === "undefined") return DEFAULT_UTM_SOURCE;

  const params = new URLSearchParams(window.location.search);

  return resolveUTMSource(params.get("utm_source") || params.get("source"));
}