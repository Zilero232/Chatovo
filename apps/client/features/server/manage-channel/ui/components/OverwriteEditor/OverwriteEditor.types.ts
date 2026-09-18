import type { ChannelType } from '@chatovo/schemas';

import type { OverwriteTarget } from '../../../model/hooks/use-overwrite-editor.types';

export type OverwriteEditorProps = {
  allow: bigint;
  channelType: ChannelType;
  deny: bigint;
  hasOverwrite: boolean;
  isDirty: boolean;
  isSaving: boolean;
  target: OverwriteTarget | null;
  onChange: (next: { allow: bigint; deny: bigint }) => void;
  onRemove: () => void;
  onSave: () => void;
};
