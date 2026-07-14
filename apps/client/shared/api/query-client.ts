import { QueryClient } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: secondsToMilliseconds(60),
    },
  },
});
