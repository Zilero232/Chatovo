import { api, readErrorMessage } from '../http';

import type {
  FriendEntry,
  FriendRequestEntry,
  FriendshipRelation,
  FriendUser,
  IncomingFriendCall,
  IncomingFriendCallResponse,
  OutgoingFriendCallResponse,
  Room,
  SendFriendRequestInput,
} from '@chatovo/schemas';

export const listFriends = async (): Promise<FriendEntry[]> => {
  try {
    const res = await api.friends.$get();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to list friends: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to list friends');
  }
};

export const listIncomingFriendRequests = async (): Promise<FriendRequestEntry[]> => {
  try {
    const res = await api.friends.requests.incoming.$get();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to list friend requests: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to list friend requests');
  }
};

export const getFriendshipRelation = async (userId: string): Promise<FriendshipRelation> => {
  try {
    const res = await api.friends.relations[':userId'].$get({ param: { userId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to get friendship relation: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to get friendship relation');
  }
};

export const sendFriendRequest = async (
  input: SendFriendRequestInput,
): Promise<FriendshipRelation> => {
  try {
    const res = await api.friends.requests.$post({ json: input });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to send friend request: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to send friend request');
  }
};

export const findFriendByTag = async (tag: string): Promise<FriendUser> => {
  try {
    const res = await api.friends.lookup[':tag'].$get({ param: { tag } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to find user by tag: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to find user by tag');
  }
};

export const acceptFriendRequest = async (friendshipId: string): Promise<FriendshipRelation> => {
  try {
    const res = await api.friends.requests[':id'].accept.$post({ param: { id: friendshipId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to accept friend request: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to accept friend request');
  }
};

export const declineFriendRequest = async (friendshipId: string): Promise<void> => {
  try {
    const res = await api.friends.requests[':id'].decline.$post({ param: { id: friendshipId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to decline friend request: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to decline friend request');
  }
};

export const removeFriendship = async (userId: string): Promise<void> => {
  try {
    const res = await api.friends[':userId'].$delete({ param: { userId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to remove friendship: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to remove friendship');
  }
};

export const getOrCreateFriendDmRoom = async (userId: string): Promise<Room> => {
  try {
    const res = await api.friends[':userId']['dm-room'].$post({ param: { userId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to open direct chat: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to open direct chat');
  }
};

export const ringFriendCall = async (userId: string): Promise<Room> => {
  try {
    const res = await api.friends[':userId'].call.$post({ param: { userId } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to start call: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to start call');
  }
};

export const getIncomingFriendCall = async (): Promise<IncomingFriendCallResponse> => {
  try {
    const res = await api.friends.calls.incoming.$get();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to get incoming call: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to get incoming call');
  }
};

export const acceptIncomingFriendCall = async (): Promise<IncomingFriendCall | null> => {
  try {
    const res = await api.friends.calls.accept.$post();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to accept call: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to accept call');
  }
};

export const declineIncomingFriendCall = async (): Promise<void> => {
  try {
    const res = await api.friends.calls.decline.$post();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to decline call: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to decline call');
  }
};

export const cancelOutgoingFriendCall = async (): Promise<void> => {
  try {
    const res = await api.friends.calls.cancel.$post();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to cancel call: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to cancel call');
  }
};

export const getOutgoingFriendCall = async (): Promise<OutgoingFriendCallResponse> => {
  try {
    const res = await api.friends.calls.outgoing.$get();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to get outgoing call: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to get outgoing call');
  }
};

export const ackOutgoingFriendCall = async (): Promise<void> => {
  try {
    const res = await api.friends.calls.ack.$post();

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to ack call: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to ack call');
  }
};
