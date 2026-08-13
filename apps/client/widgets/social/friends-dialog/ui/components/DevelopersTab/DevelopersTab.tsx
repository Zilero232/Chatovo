'use client';

import type { UserProfile } from '@chatovo/schemas';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { useCurrentUser, useDevelopers } from '@/entities/auth/user';
import { useFriends } from '@/entities/social/friend';
import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';
import { CenteredState, Spinner } from '@/shared/ui';

import type { DevelopersTabProps } from './DevelopersTab.types';

import { DeveloperListItem } from './DeveloperListItem';

import s from '../../FriendsDialog.module.scss';

const hasDevelopers = (developers: UserProfile[] | undefined): developers is UserProfile[] =>
  (developers?.length ?? 0) > 0;

export const DevelopersTab = ({ enabled }: DevelopersTabProps) => {
  const t = useTranslations('friends');

  const { user } = useCurrentUser();

  const { data: allDevelopers, isPending } = useDevelopers(enabled);
  const { data: friends } = useFriends(enabled);

  const friendIds = new Set((friends ?? []).map((entry) => entry.user.id));
  const developers = allDevelopers?.filter((developer) => developer.id !== user?.id);

  return match({ isPending, developers })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ developers: P.when(hasDevelopers) }, ({ developers: items }) => (
      <div className={s.list}>
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((developer) => (
            <motion.div
              key={developer.id}
              animate={LIST_ITEM_ANIMATE}
              exit={LIST_ITEM_EXIT}
              initial={LIST_ITEM_INITIAL}
              layout='position'
              transition={LIST_ITEM_TRANSITION}
            >
              <DeveloperListItem developer={developer} isFriend={friendIds.has(developer.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ))
    .otherwise(() => (
      <CenteredState
        className={s.empty}
        description={t('emptyDevelopersHint')}
        pattern='dots'
        size='sm'
        title={t('emptyDevelopersTitle')}
      />
    ));
};
