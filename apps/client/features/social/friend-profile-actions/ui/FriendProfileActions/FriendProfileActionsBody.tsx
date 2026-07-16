'use client';

import { useState } from 'react';
import { match } from 'ts-pattern';

import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { useFriendProfileActions } from '../../model/hooks';
import {
  AddFriendAction,
  CancelRequestAction,
  FriendActions,
  IncomingRequestActions,
} from './components';

import type { FriendProfileActionsBodyProps } from './FriendProfileActionsBody.types';

export const FriendProfileActionsBody = ({
  state,
  userId,
  friendTag,
  displayName,
  avatarUrl,
  verified,
}: FriendProfileActionsBodyProps) => {
  const [removeOpen, setRemoveOpen] = useState(false);

  const { isBusy, add, cancelRequest, accept, decline, call, openChat } = useFriendProfileActions({
    userId,
    friendTag,
    displayName,
    avatarUrl,
    verified,
  });

  return (
    <>
      {match(state)
        .with({ status: 'none' }, () => <AddFriendAction isBusy={isBusy} onAdd={add} />)
        .with({ status: 'outgoing_pending' }, () => (
          <CancelRequestAction isBusy={isBusy} onCancel={cancelRequest} />
        ))
        .with({ status: 'incoming_pending' }, ({ friendshipId }) => (
          <IncomingRequestActions
            isBusy={isBusy}
            onAccept={() => accept(friendshipId)}
            onDecline={() => decline(friendshipId)}
          />
        ))
        .with({ status: 'friends' }, () => (
          <FriendActions
            isBusy={isBusy}
            onCall={call}
            onOpenChat={openChat}
            onRemove={() => setRemoveOpen(true)}
          />
        ))
        .exhaustive()}

      <RemoveFriendConfirmDialog
        friendName={displayName}
        open={removeOpen}
        userId={userId}
        onOpenChange={setRemoveOpen}
      />
    </>
  );
};
