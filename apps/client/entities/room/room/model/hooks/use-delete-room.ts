import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filter } from 'remeda';

import { deleteRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { Room } from '@chatovo/schemas';

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) =>
        filter(prev ?? [], (r) => r.id !== id),
      );

      queryClient.removeQueries({ queryKey: QUERY_KEYS.room(id) });
    },
  });
};
