import { api, readErrorMessage } from '../http';
import type { CreateRoomRequest, Room, UpdateRoomRequest } from '@chatovo/schemas';

export const listRooms = async (): Promise<Room[]> => {
  try {
    const res = await api.rooms.$get();

    if (!res.ok) {
      throw new Error(`Failed to list rooms: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to list rooms');
  }
};

export const createRoom = async (input: CreateRoomRequest): Promise<Room> => {
  try {
    const res = await api.rooms.$post({ json: input });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to create room: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to create room');
  }
};

export const getRoom = async (id: string): Promise<Room> => {
  try {
    const res = await api.rooms[':id'].$get({ param: { id } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to get room: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to get room');
  }
};

export const updateRoom = async (id: string, input: UpdateRoomRequest): Promise<Room> => {
  try {
    const res = await api.rooms[':id'].$patch({ param: { id }, json: input });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to update room: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to update room');
  }
};

export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const res = await api.rooms[':id'].$delete({ param: { id } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to delete room: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to delete room');
  }
};
