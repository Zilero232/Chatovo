'use client';

import { clsx } from 'clsx';
import { Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { useAppSettings } from '@/entities/app/settings';
import { InvisibleModeMenuItem } from '@/features/app/invisible-mode';
import { ROUTES } from '@/shared/constants';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui-kit';

import type { AdminShortcutProps } from './AdminShortcut.types';

import s from './AdminShortcut.module.scss';

export const AdminShortcut = ({ onNavigate }: AdminShortcutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('admin');

  const { settings } = useAppSettings();

  const isInAdmin = pathname.startsWith(ROUTES.admin);
  const isInvisible = settings.system.invisibleMode;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={clsx(s.trigger, {
          [s.active]: isInAdmin,
          [s.invisible]: isInvisible
        })}
        variant='ghost'
      >
        <span aria-hidden className={s.icon}>
          <Wrench />
        </span>
        <span className={s.label}>{t('title')}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start'>
        <DropdownMenuItem
          onSelect={() => {
            router.push(ROUTES.admin);
            onNavigate?.();
          }}
        >
          <Wrench />
          {t('title')}
        </DropdownMenuItem>

        <InvisibleModeMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
