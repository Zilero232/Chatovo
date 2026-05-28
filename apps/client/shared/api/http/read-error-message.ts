// Hono error responses are `{ error: string }`. Read it safely — non-JSON
// bodies (e.g. plain text 500s) must not crash the caller's catch block.
export const readErrorMessage = async (res: Response): Promise<string | null> => {
  try {
    const body = (await res.json()) as { error?: string } | null;

    return body?.error ?? null;
  } catch {
    return null;
  }
};
