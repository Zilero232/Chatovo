import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/shared/api';
import { Button } from '@/shared/ui/button';

export const LogoutButton = () => {
  const handleClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleClick} aria-label="Logout">
      <LogOut className="size-4" />
    </Button>
  );
};
