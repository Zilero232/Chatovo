'use client';

import { PERMISSIONS } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';

import { Label, Switch, Text } from '@/ui-kit';

import type { PermissionToggleListProps } from './PermissionToggleList.types';

import { PERMISSION_GROUPS } from '../../lib/permission-groups';

import s from './PermissionToggleList.module.scss';

export const PermissionToggleList = ({
  value,
  disabled = false,
  onChange
}: PermissionToggleListProps) => {
  const t = useTranslations('server.permissions');

  return (
    <div className={s.root}>
      {PERMISSION_GROUPS.map((group) => (
        <section key={group.key} className={s.group}>
          <Text className={s.groupTitle} size='xs' tone='muted' weight='medium'>
            {t(`group${group.key.charAt(0).toUpperCase()}${group.key.slice(1)}` as never)}
          </Text>

          {group.permissions.map((permission) => {
            const bit = PERMISSIONS[permission];
            const id = `permission-${permission}`;
            const checked = (value & bit) !== 0n;

            return (
              <div key={permission} className={s.row}>
                <Label className={s.label} htmlFor={id}>
                  {t(permission)}
                </Label>
                <Switch
                  checked={checked}
                  disabled={disabled}
                  id={id}
                  onCheckedChange={(next) => onChange(next ? value | bit : value & ~bit)}
                />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};
