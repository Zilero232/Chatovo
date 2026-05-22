export const safeJsonParse = (value: string | undefined): object => {
  try {
    const parsed = JSON.parse(value ?? '');

    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
