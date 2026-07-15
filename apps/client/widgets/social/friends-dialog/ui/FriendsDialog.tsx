'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { UserPlus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/entities/auth/user';
import {
  FriendTag,
  useCloseWhenCallAccepted,
  useIncomingFriendRequests,
  useSendFriendRequest,
} from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';
import { formatBadgeCount } from '@/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  IconButtonWithTooltip,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui';
import { FriendsTab, RequestsTab } from './components';

import s from './FriendsDialog.module.scss';

export const FriendsDialog = () => {
  const t = useTranslations('friends');

  const [open, toggleOpen] = useBoolean(false);
  const [friendTag, setFriendTag] = useState('');
  const { friendTag: ownFriendTag } = useCurrentUser();
  const { blocksParentDialogClose, dmUnread } = useFriendChat();

  const { data: requests } = useIncomingFriendRequests();
  const sendRequest = useSendFriendRequest();

  useCloseWhenInVoiceRoom(() => toggleOpen(false));
  useCloseWhenCallAccepted(() => toggleOpen(false));

  const incomingCount = requests?.length ?? 0;
  const triggerBadgeCount = dmUnread + incomingCount;
  const canSend = friendTag.trim().length > 0 && !sendRequest.isPending;

  return (
    <>
      <div className={s.triggerWrap}>
        <IconButtonWithTooltip
          icon={<Users />}
          label={t('title')}
          variant="ghost"
          onClick={() => toggleOpen(true)}
        />
        {triggerBadgeCount > 0 && (
          <span className={s.triggerBadge}>{formatBadgeCount(triggerBadgeCount)}</span>
        )}
      </div>

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
          {ownFriendTag && (
            <div className={s.ownTagRow}>
              <span className={s.ownTagLabel}>{t('yourTagLabel')}</span>
              <FriendTag tag={ownFriendTag} />
            </div>
          )}

          <div className={s.searchRow}>
            <Input
              className={s.searchInput}
              placeholder={t('tagPlaceholder')}
              value={friendTag}
              onChange={(event) => setFriendTag(event.target.value)}
            />
            <Button
              disabled={!canSend}
              size="sm"
              onClick={() => {
                const tag = friendTag.trim().toLowerCase();

                sendRequest.mutate(
                  { tag },
                  {
                    onSuccess: () => {
                      setFriendTag('');
                      toast.success(t('requestSent'));
                    },
                    onError: () => {
                      toast.error(t('sendFailed'));
                    },
                  },
                );
              }}
            >
              <UserPlus aria-hidden />
              {t('sendByTag')}
            </Button>
          </div>

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
