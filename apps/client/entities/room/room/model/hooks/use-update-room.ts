import { useMutation, useQueryClient } from '@tanstack/react-query';
import { map } from 'remeda';

import { updateRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { Room, UpdateRoomRequest } from '@chatovo/schemas';

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoomRequest }) => updateRoom(id, input),
    onSuccess: (room) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) =>
        map(prev ?? [], (r) => (r.id === room.id ? room : r)),
      );

      queryClient.setQueryData<Room>(QUERY_KEYS.room(room.id), room);
    },
  });
};
