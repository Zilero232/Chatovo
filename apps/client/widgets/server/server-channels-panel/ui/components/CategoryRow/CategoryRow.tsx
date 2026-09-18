'use client';

import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

import type { CategoryRowProps } from './CategoryRow.types';

import { CategoryRowMenu } from '../CategoryRowMenu/CategoryRowMenu';

import s from './CategoryRow.module.scss';

export const CategoryRow = ({
  category,
  serverId,
  collapsed,
  canManage,
  onToggle
}: CategoryRowProps) => (
  <div className={s.root}>
    <button aria-expanded={!collapsed} className={s.toggle} type='button' onClick={onToggle}>
      <ChevronDown aria-hidden className={clsx(s.chevron, { [s.chevronClosed]: collapsed })} />
      <span className={s.name}>{category.name}</span>
    </button>

    {canManage && <CategoryRowMenu category={category} className={s.menu} serverId={serverId} />}
  </div>
);
