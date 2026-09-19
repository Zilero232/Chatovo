'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useFriends, useIncomingFriendRequests } from '@/entities/social/friend';
import { SearchField, Tabs, TabsContent } from '@/ui-kit';

import type { FriendsTabValue } from './FriendsTabs.types';

import { AddFriendTab } from '../AddFriendTab/AddFriendTab';
import { DevelopersTab } from '../DevelopersTab/DevelopersTab';
import { FriendsTab } from '../FriendsTab/FriendsTab';
import { FriendsTabsBar } from '../FriendsTabsBar/FriendsTabsBar';
import { RequestsTab } from '../RequestsTab/RequestsTab';

import s from '../../FriendsPanel.module.scss';

export const FriendsTabs = () => {
  const t = useTranslations('friends');

  const { data: friends } = useFriends();
  const { data: requests } = useIncomingFriendRequests();

  const [tab, setTab] = useState<FriendsTabValue>('online');
  const [query, setQuery] = useState('');

  const friendsCount = friends?.length ?? 0;
  const incomingCount = requests?.length ?? 0;
  const onlineCount = (friends ?? []).filter((entry) => entry.user.isOnline).length;

  return (
    <Tabs className={s.tabs} value={tab} onValueChange={(next) => setTab(next as FriendsTabValue)}>
      <FriendsTabsBar
        friendsCount={friendsCount}
        incomingCount={incomingCount}
        isAddActive={tab === 'add'}
        onAddFriend={() => setTab('add')}
      />

      <div className={s.body}>
        <TabsContent className={s.tabContent} value='online'>
          <SearchField
            className={s.search}
            placeholder={t('searchPlaceholder')}
            value={query}
            onValueChange={setQuery}
          />
          <FriendsTab
            onlyOnline
            countLabel={t('onlineCount', { count: onlineCount })}
            query={query}
          />
        </TabsContent>

        <TabsContent className={s.tabContent} value='all'>
          <SearchField
            className={s.search}
            placeholder={t('searchPlaceholder')}
            value={query}
            onValueChange={setQuery}
          />
          <FriendsTab countLabel={t('allCount', { count: friendsCount })} query={query} />
        </TabsContent>

        <TabsContent className={s.tabContent} value='pending'>
          <RequestsTab />
        </TabsContent>

        <TabsContent className={s.tabContent} value='developers'>
          <DevelopersTab />
        </TabsContent>

        <TabsContent className={s.tabContent} value='add'>
          <AddFriendTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
