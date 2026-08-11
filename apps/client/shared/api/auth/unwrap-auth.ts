type AuthResult<TData> = {
  data: TData;
  error?: { message?: string } | null;
};

export const unwrapAuth = async <TData>(
  request: Promise<AuthResult<TData>>,
  fallbackMessage: string
): Promise<TData> => {
  const { data, error } = await request;

  if (error) {
    throw new Error(error.message ?? fallbackMessage);
  }

  return data;
};
