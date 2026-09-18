'use client';

import { Compass, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CreateServerDialog } from '@/features/server/create';
import { JoinServerDialog } from '@/features/server/join';
import { IconButtonWithTooltip } from '@/ui-kit';

import type { ServerRailActionsProps } from './ServerRailActions.types';

import s from './ServerRailActions.module.scss';

export const ServerRailActions = ({ orientation }: ServerRailActionsProps) => {
  const t = useTranslations('server.rail');

  const side = orientation === 'vertical' ? 'right' : 'top';

  return (
    <div className={s.root}>
      <CreateServerDialog
        trigger={
          <IconButtonWithTooltip
            className={s.action}
            icon={<Plus />}
            label={t('createServer')}
            tooltipSide={side}
            type='button'
          />
        }
      />
      <JoinServerDialog
        trigger={
          <IconButtonWithTooltip
            className={s.action}
            icon={<Compass />}
            label={t('joinServer')}
            tooltipSide={side}
            type='button'
          />
        }
      />
    </div>
  );
};
