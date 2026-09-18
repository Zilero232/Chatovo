import type { ChannelOverwrite, ServerMember, ServerRole } from '@chatovo/schemas';

import type { OverwriteTarget } from '../../../model/hooks/use-overwrite-editor.types';

export type OverwriteTargetListProps = {
  members: ServerMember[];
  overwrites: ChannelOverwrite[];
  roles: ServerRole[];
  selected: OverwriteTarget | null;
  onSelect: (target: OverwriteTarget) => void;
};
