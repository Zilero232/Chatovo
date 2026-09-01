'use client';

import { Phone, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { useCallFriend } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { Button, Dialog, DialogContent, DialogTitle, Spinner } from '@/ui-kit';
import { ChatConversation } from '@/widgets/chat/chat-panel';

import s from './FriendChatDialog.module.scss';

export const FriendChatDialog = () => {
  const t = useTranslations('chat');
  const tFriends = useTranslations('friends');
  const errorMessage = useErrorMessage();
  const { user } = useCurrentUser();
  const { session, openingPeer, isOpening, close } = useFriendChat();
  const callFriend = useCallFriend();

  const peer = session?.peer ?? openingPeer;
  const open = peer !== null;
  const roomId = session?.roomId ?? null;
  const currentUserId = user?.id ?? '';

  const handleCall = () => {
    if (!peer) {
      return;
    }

    callFriend.mutate(
      { userId: peer.id },
      { onError: (err: Error) => toast.error(errorMessage(err), { id: `friend-call-${peer.id}` }) }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          close();
        }
      }}
    >
      <DialogContent className={s.content} overlayClassName={s.overlay} showCloseButton={false}>
        {peer && (
          <header className={s.header}>
            <div className={s.headerMain}>
              <UserAvatar name={peer.name} size='sm' src={peer.avatarUrl} />
              <DialogTitle className={s.name}>
                <UserName developer={peer.developer} name={peer.name} verified={peer.verified} />
              </DialogTitle>
            </div>
            <div className={s.headerActions}>
              <Button
                aria-label={tFriends('callFriend')}
                disabled={callFriend.isPending || isOpening || !roomId}
                size='icon-sm'
                type='button'
                variant='ghost'
                onClick={handleCall}
              >
                <Phone />
              </Button>
              <Button
                aria-label={t('close')}
                size='icon-sm'
                type='button'
                variant='ghost'
                onClick={close}
              >
                <X />
              </Button>
            </div>
          </header>
        )}

        <div className={s.body}>
          {isOpening || !roomId ? (
            <div className={s.loading}>
              <Spinner />
            </div>
          ) : (
            <ChatConversation currentUserId={currentUserId} roomId={roomId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
