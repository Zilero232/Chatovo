import { ShieldCheck } from 'lucide-react';
import { useCurrentUser } from '@/entities/user';
import { LogoutButton } from '@/features/logout';

export const Topbar = () => {
  const { user, isAdmin } = useCurrentUser();

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center gap-3">
        <span className="font-semibold tracking-tight">Solvex</span>
        {isAdmin ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
            <ShieldCheck className="size-3" /> admin
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">{user?.email}</span>
        <LogoutButton />
      </div>
    </header>
  );
};
