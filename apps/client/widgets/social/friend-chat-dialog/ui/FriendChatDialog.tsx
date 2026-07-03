'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { useFriendChat } from '@/features/social/friend-chat';
import { Button, Dialog, DialogClose, DialogContent, DialogTitle, Spinner } from '@/shared/ui';
import { ChatConversation } from '@/widgets/chat/chat-panel';
import { friendChatDialogStyles as s } from './FriendChatDialog.styles';

export const FriendChatDialog = () => {
  const t = useTranslations('chat');
  const { user } = useCurrentUser();
  const { session, openingPeer, isOpening, close } = useFriendChat();

  const peer = session?.peer ?? openingPeer;
  const open = peer !== null;
  const roomId = session?.roomId ?? null;
  const currentUserId = user?.id ?? '';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          close();
        }
      }}
    >
      <DialogContent className={s.content} showCloseButton={false}>
        {peer && (
          <header className={s.header}>
            <div className={s.headerMain}>
              <UserAvatar name={peer.name} size="sm" src={peer.avatarUrl} />
              <DialogTitle className={s.name}>
                <UserName name={peer.name} verified={peer.verified} />
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Button aria-label={t('close')} size="icon-sm" type="button" variant="ghost">
                <X />
              </Button>
            </DialogClose>
          </header>
        )}

        <div className={s.body}>
          {isOpening || !roomId ? (
            <div className={s.loading}>
              <Spinner />
            </div>
          ) : (
            <ChatConversation roomId={roomId} currentUserId={currentUserId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
