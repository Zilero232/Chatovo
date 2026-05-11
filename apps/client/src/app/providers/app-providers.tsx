import { useMount } from '@siberiacancode/reactuse';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/app/router';
import { bootstrapAuth, useAuthStore } from '@/entities/user';
import { QueryProvider } from './query';
import { ThemeProvider } from './theme';

const BootSplash = () => (
  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
    Loading...
  </div>
);

export const AppProviders = () => {
  const isLoading = useAuthStore((s) => s.isLoading);
  useMount(() => {
    bootstrapAuth();
  });

  return (
    <ThemeProvider>
      <QueryProvider>
        {isLoading ? <BootSplash /> : <RouterProvider router={router} />}
      </QueryProvider>
    </ThemeProvider>
  );
};
