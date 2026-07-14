import { api, readErrorMessage } from '../http';

import type { RegisterPushDeviceInput, UnregisterPushDeviceInput } from '@chatovo/schemas';

export const registerPushDevice = async (input: RegisterPushDeviceInput): Promise<void> => {
  const res = await api.push.devices.$post({ json: input });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to register push device: ${res.status}`);
  }
};

export const unregisterPushDevice = async (input: UnregisterPushDeviceInput): Promise<void> => {
  const res = await api.push.devices.$delete({ json: input });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to unregister push device: ${res.status}`);
  }
};
