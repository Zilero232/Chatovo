'use client';

import { PERMISSIONS } from '@chatovo/schemas';
import { clsx } from 'clsx';
import { Check, Minus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Text } from '@/ui-kit';

import type { OverwriteState } from '../../lib/permission-groups';
import type { PermissionOverwriteListProps } from './PermissionOverwriteList.types';

import { groupsForChannelType } from '../../lib/permission-groups';

import s from './PermissionOverwriteList.module.scss';

const STATES: { icon: typeof Check; value: OverwriteState }[] = [
  { value: 'deny', icon: X },
  { value: 'inherit', icon: Minus },
  { value: 'allow', icon: Check }
];

export const PermissionOverwriteList = ({
  allow,
  deny,
  channelType,
  disabled = false,
  onChange
}: PermissionOverwriteListProps) => {
  const t = useTranslations('server.permissions');

  const readState = (bit: bigint): OverwriteState => {
    if ((allow & bit) !== 0n) {
      return 'allow';
    }

    return (deny & bit) !== 0n ? 'deny' : 'inherit';
  };

  const apply = (bit: bigint, next: OverwriteState) => {
    const cleared = { allow: allow & ~bit, deny: deny & ~bit };

    if (next === 'allow') {
      onChange({ ...cleared, allow: cleared.allow | bit });
    } else if (next === 'deny') {
      onChange({ ...cleared, deny: cleared.deny | bit });
    } else {
      onChange(cleared);
    }
  };

  return (
    <div className={s.root}>
      {groupsForChannelType(channelType).map((group) => (
        <section key={group.key} className={s.group}>
          <Text className={s.groupTitle} size='xs' tone='muted' weight='medium'>
            {t(`group${group.key.charAt(0).toUpperCase()}${group.key.slice(1)}` as never)}
          </Text>

          {group.permissions.map((permission) => {
            const bit = PERMISSIONS[permission];
            const current = readState(bit);

            return (
              <div key={permission} className={s.row}>
                <span className={s.label}>{t(permission)}</span>
                <div aria-label={t(permission)} className={s.segment} role='radiogroup'>
                  {STATES.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      aria-checked={current === value}
                      aria-label={t(value)}
                      className={clsx(s.option, s[value], { [s.active]: current === value })}
                      disabled={disabled}
                      role='radio'
                      type='button'
                      onClick={() => apply(bit, value)}
                    >
                      <Icon aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};
