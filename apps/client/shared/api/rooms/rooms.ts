import type { Room } from '@chatovo/schemas';

import { api } from '../http';

export const getRoom = async (id: string): Promise<Room> => {
  const { data } = await api.get(`/rooms/${id}`);

  return data;
};
