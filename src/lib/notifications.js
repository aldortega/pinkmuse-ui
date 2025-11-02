export const DEFAULT_NOTIFICATION_PREFERENCES = [
  "evento",
  "producto",
  "noticia",
];

const toNormalizedPreference = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "" ? null : normalized;
};

export const normalizeNotificationPreferences = (
  value,
  { fallbackToDefault = true } = {}
) => {
  const isNullish = value === null || value === undefined;
  const source = Array.isArray(value) ? value : [];

  const normalized = Array.from(
    new Set(
      source
        .map(toNormalizedPreference)
        .filter((item) => item !== null && item !== undefined)
    )
  );

  if (normalized.length === 0) {
    if (isNullish && fallbackToDefault) {
      return [...DEFAULT_NOTIFICATION_PREFERENCES];
    }
    return [];
  }

  return normalized;
};
