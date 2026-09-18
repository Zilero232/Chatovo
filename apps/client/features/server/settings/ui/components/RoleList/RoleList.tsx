'use client';

import { clsx } from 'clsx';
import { ChevronDown, ChevronUp, Plus, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, ScrollArea } from '@/ui-kit';

import type { RoleListProps } from './RoleList.types';

import s from './RoleList.module.scss';

export const RoleList = ({ roles, selectedId, onSelect, onCreate, onMove }: RoleListProps) => {
  const t = useTranslations('server.roles');

  return (
    <div className={s.root}>
      <Button className={s.create} size='sm' type='button' variant='secondary' onClick={onCreate}>
        <Plus />
        {t('create')}
      </Button>

      <ScrollArea className={s.scroll}>
        {roles.map((role, index) => (
          <div key={role.id} className={clsx(s.row, { [s.active]: role.id === selectedId })}>
            <button className={s.item} type='button' onClick={() => onSelect(role.id)}>
              <Shield style={role.color ? { color: role.color } : undefined} />
              <span className={s.label}>{role.isDefault ? `@${role.name}` : role.name}</span>
            </button>

            {!role.isDefault && (
              <span className={s.moves}>
                <Button
                  aria-label='↑'
                  disabled={index === 0}
                  size='icon-xs'
                  type='button'
                  variant='ghost'
                  onClick={() => onMove(role.id, -1)}
                >
                  <ChevronUp />
                </Button>
                <Button
                  aria-label='↓'
                  disabled={roles[index + 1]?.isDefault ?? true}
                  size='icon-xs'
                  type='button'
                  variant='ghost'
                  onClick={() => onMove(role.id, 1)}
                >
                  <ChevronDown />
                </Button>
              </span>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
