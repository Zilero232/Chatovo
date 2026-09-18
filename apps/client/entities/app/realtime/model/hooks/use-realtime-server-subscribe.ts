'use client';

import { useEffect } from 'react';

import { addSubscriptionServers, removeSubscriptionServers } from '../lib/subscription-registry';
import { syncRoomSubscriptions } from '../lib/subscription-sync';

export const useRealtimeServerSubscribe = (serverIds: string[]) => {
  const serversKey = [...serverIds].sort().join(',');

  useEffect(() => {
    const servers = serversKey.length > 0 ? serversKey.split(',') : [];

    addSubscriptionServers(servers);
    syncRoomSubscriptions();

    return () => {
      removeSubscriptionServers(servers);
      syncRoomSubscriptions();
    };
  }, [serversKey]);
};
