'use client';

import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui-kit';

import type { FriendsTabsProps } from './FriendsTabs.types';

import { DevelopersTab } from '../DevelopersTab/DevelopersTab';
import { FriendsTab } from '../FriendsTab/FriendsTab';
import { RequestsTab } from '../RequestsTab/RequestsTab';

import s from '../../FriendsDialog.module.scss';

export const FriendsTabs = ({ friendsCount, incomingCount, isOpen }: FriendsTabsProps) => {
  const t = useTranslations('friends');

  return (
    <Tabs defaultValue='friends'>
      <TabsList className={s.tabsList}>
        <TabsTrigger value='friends'>
          {t('friendsTab')}
          {friendsCount > 0 && <span className={s.count}>{friendsCount}</span>}
        </TabsTrigger>
        <TabsTrigger value='requests'>
          {t('requestsTab')}
          {incomingCount > 0 && <span className={s.badge}>{incomingCount}</span>}
        </TabsTrigger>
        <TabsTrigger value='developers'>{t('developersTab')}</TabsTrigger>
      </TabsList>

      <TabsContent value='friends'>
        <FriendsTab enabled={isOpen} />
      </TabsContent>

      <TabsContent value='requests'>
        <RequestsTab />
      </TabsContent>

      <TabsContent value='developers'>
        <DevelopersTab enabled={isOpen} />
      </TabsContent>
    </Tabs>
  );
};
