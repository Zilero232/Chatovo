import type { ServerRole } from '@chatovo/schemas';

import type { RoleDraft } from '../../../model/hooks';

export type RoleEditorProps = {
  draft: RoleDraft;
  isDirty: boolean;
  isSaving: boolean;
  role: ServerRole;
  onChange: (next: Partial<RoleDraft>) => void;
  onDelete: () => void;
  onSave: () => void;
};
