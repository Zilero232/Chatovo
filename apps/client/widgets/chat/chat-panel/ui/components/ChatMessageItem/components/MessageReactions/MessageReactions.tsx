'use client';

import { clsx } from 'clsx';
import { isEmpty } from 'remeda';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageReactions.module.scss';

export const MessageReactions = () => {
  const { message, currentUserId, canReact, toggleReaction } = useChatMessage();

  const reactions = message.reactions ?? [];

  if (isEmpty(reactions)) {
    return null;
  }

  return (
    <div className={s.root}>
      {reactions.map((reaction) => {
        const mine = reaction.userIds.includes(currentUserId);

        return (
          <button
            key={reaction.emoji}
            className={clsx(s.pill, { [s.mine]: mine })}
            disabled={!canReact}
            type='button'
            onClick={() => toggleReaction(reaction.emoji, mine)}
          >
            <span className={s.emoji}>{reaction.emoji}</span>
            <span className={s.count}>{reaction.count}</span>
          </button>
        );
      })}
    </div>
  );
};
