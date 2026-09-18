import type { ServerRole } from '@chatovo/schemas';

export type RoleListProps = {
  roles: ServerRole[];
  selectedId: string | null;
  onCreate: () => void;
  onMove: (roleId: string, direction: -1 | 1) => void;
  onSelect: (roleId: string) => void;
};
