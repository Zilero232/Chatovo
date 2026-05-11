import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTheme } from '@/app/providers/theme';
import { Toaster } from '@/shared/ui/sonner';

const RootLayout = () => {
  const { theme } = useTheme();
  return (
    <>
      <Outlet />
      <Toaster richColors closeButton position="top-right" theme={theme} />
      {import.meta.env.DEV ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
