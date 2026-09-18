import type { Channel, CreateChannelRequest } from '@chatovo/schemas';
import type { UseFormReturn } from 'react-hook-form';

export type ChannelFormProps = {
  channel?: Channel | null;
  categoryId?: string | null;
  serverId: string;
  onDone?: () => void;
};

export type ChannelFieldsProps = {
  form: UseFormReturn<CreateChannelRequest>;
};
