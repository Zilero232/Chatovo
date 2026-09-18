export type ServerSettingsTab = 'bans' | 'invites' | 'members' | 'overview' | 'roles';

export type ServerSettingsDialogProps = {
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
