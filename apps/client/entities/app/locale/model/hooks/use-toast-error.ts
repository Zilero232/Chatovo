'use client';

import { toast } from 'sonner';

import { useErrorMessage } from './use-error-message';

/** Builds a mutation `onError` handler that shows the localized message under a stable toast id. */
export const useToastError = () => {
  const errorMessage = useErrorMessage();

  return (id: string) => (error: unknown) => {
    toast.error(errorMessage(error), { id });
  };
};
