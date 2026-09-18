'use client';

import { useRouter } from 'next/navigation';

import type { FriendChatPeer } from '@/features/social/friend-chat';

import { FriendProfileActions } from '@/features/social/friend-profile-actions';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { buildDmHref } from '@/shared/lib';

import type { FriendProfileActionsPanelProps } from './FriendProfileActionsPanel.types';

export const FriendProfileActionsPanel = ({
  userId,
  friendTag,
  displayName,
  avatarUrl,
  verified,
  developer
}: FriendProfileActionsPanelProps) => {
  const router = useRouter();

  const peer: FriendChatPeer = { id: userId, name: displayName, avatarUrl, verified, developer };

  return (
    <FriendProfileActions
      renderRemoveConfirm={({ open, onOpenChange }) => (
        <RemoveFriendConfirmDialog
          friendName={displayName}
          open={open}
          userId={userId}
          onOpenChange={onOpenChange}
        />
      )}
      friendTag={friendTag}
      userId={userId}
      onOpenChat={() => router.push(buildDmHref(peer.id))}
    />
  );
};
