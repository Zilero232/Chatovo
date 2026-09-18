import type { ClipboardEvent } from 'react';

import type { ChatLine } from '../../../model/types';

export type ChatComposerProps = {
  isUploading: boolean;
  replyTo?: ChatLine | null;
  serverId?: string | null;
  onAttach: () => void;
  onCancelReply?: () => void;
  onPaste: (event: ClipboardEvent) => void;
  onSend: (value: string) => Promise<void>;
  onTyping?: () => void;
};
