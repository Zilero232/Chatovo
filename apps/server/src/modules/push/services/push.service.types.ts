import type { RegisterPushDeviceInput, UnregisterPushDeviceInput } from '@chatovo/schemas';

export type RegisterDeviceInput = {
  userId: string;
  input: RegisterPushDeviceInput;
};

export type UnregisterDeviceInput = {
  userId: string;
  input: UnregisterPushDeviceInput;
};
