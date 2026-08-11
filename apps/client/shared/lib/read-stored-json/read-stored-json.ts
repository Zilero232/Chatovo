export const readStoredJson = <TValue>(key: string, fallback: TValue): TValue => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return (JSON.parse(raw) as TValue) ?? fallback;
  } catch {
    return fallback;
  }
};
