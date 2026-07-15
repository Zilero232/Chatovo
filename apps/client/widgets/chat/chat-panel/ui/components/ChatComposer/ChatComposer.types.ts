import type { ClipboardEvent } from 'react';

export type ChatComposerProps = {
  isUploading: boolean;
  onSend: (value: string) => Promise<void>;
  onAttach: () => void;
  onPaste: (event: ClipboardEvent) => void;
};
