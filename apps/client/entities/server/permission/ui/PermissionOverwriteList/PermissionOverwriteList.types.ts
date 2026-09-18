import type { ChannelType } from '@chatovo/schemas';

export type PermissionOverwriteListProps = {
  allow: bigint;
  deny: bigint;
  channelType: ChannelType | null;
  disabled?: boolean;
  onChange: (next: { allow: bigint; deny: bigint }) => void;
};
