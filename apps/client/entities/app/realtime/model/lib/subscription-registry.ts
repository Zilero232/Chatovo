const roomRefCounts = new Map<string, number>();
const serverRefCounts = new Map<string, number>();

const retain = (counts: Map<string, number>, ids: string[]) => {
  for (const id of ids) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
};

const release = (counts: Map<string, number>, ids: string[]) => {
  for (const id of ids) {
    const next = (counts.get(id) ?? 0) - 1;

    if (next <= 0) {
      counts.delete(id);
    } else {
      counts.set(id, next);
    }
  }
};

export const addSubscriptionRooms = (roomIds: string[]) => retain(roomRefCounts, roomIds);

export const removeSubscriptionRooms = (roomIds: string[]) => release(roomRefCounts, roomIds);

export const getSubscribedRooms = (): string[] => [...roomRefCounts.keys()].sort();

export const addSubscriptionServers = (serverIds: string[]) => retain(serverRefCounts, serverIds);

export const removeSubscriptionServers = (serverIds: string[]) =>
  release(serverRefCounts, serverIds);

export const getSubscribedServers = (): string[] => [...serverRefCounts.keys()].sort();
