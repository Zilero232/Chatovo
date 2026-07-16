'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';

import { useCloseWhenCallAccepted, useIncomingFriendRequests } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui';
import {
  AddFriendForm,
  FriendsDialogTrigger,
  FriendsTab,
  OwnFriendTag,
  RequestsTab,
} from './components';

import s from './FriendsDialog.module.scss';

export const FriendsDialog = () => {
  const t = useTranslations('friends');

  const [open, toggleOpen] = useBoolean(false);
  const { blocksParentDialogClose, dmUnread } = useFriendChat();

  const { data: requests } = useIncomingFriendRequests();

  useCloseWhenInVoiceRoom(() => toggleOpen(false));
  useCloseWhenCallAccepted(() => toggleOpen(false));

  const incomingCount = requests?.length ?? 0;

  return (
    <>
      <FriendsDialogTrigger badgeCount={dmUnread + incomingCount} onOpen={() => toggleOpen(true)} />

      <Dialog
        disablePointerDismissal={blocksParentDialogClose}
        open={open}
        onOpenChange={(next) => {
          if (!next && blocksParentDialogClose) {
            return;
          }

          toggleOpen(next);
        }}
      >
        <DialogContent className={s.content}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <OwnFriendTag />
          <AddFriendForm />

          <Tabs defaultValue="friends">
            <TabsList className={s.tabsList}>
              <TabsTrigger value="friends">{t('friendsTab')}</TabsTrigger>
              <TabsTrigger value="requests">
                {t('requestsTab')}
                {incomingCount > 0 && <span className={s.badge}>{incomingCount}</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends">
              <FriendsTab enabled={open} />
            </TabsContent>

            <TabsContent value="requests">
              <RequestsTab />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
