import type { ComponentProps } from 'react';

import type { TooltipContent } from '@/ui-kit';

export type LobbyButtonProps = {
  side?: ComponentProps<typeof TooltipContent>['side'];
  onNavigate?: () => void;
};
