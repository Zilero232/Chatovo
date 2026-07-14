'use client';

import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';
import { AppSidebar } from '@/widgets/app/app-sidebar';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import s from './MobileNav.module.scss';
import type { MobileNavProps } from './MobileNav.types';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('appSidebar');

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className={clsx('glass-strong', s.topBar)}>
        <div className={s.topBarInner}>
          <SheetTrigger asChild>
            <Button
              aria-label={t('openMenu')}
              className={s.menuButton}
              size="icon"
              variant="ghost"
              type="button"
            >
              <Menu />
            </Button>
          </SheetTrigger>

          <div className={s.brand}>
            <span className={s.brandTitle}>Chatovo</span>
          </div>

          <LanguageSwitcher />
        </div>
      </div>

      <SheetContent className={s.sheet} side="left" showCloseButton={false}>
        <SheetTitle className={s.sheetTitleSr}>{t('menu')}</SheetTitle>
        <SheetDescription className={s.sheetTitleSr}>{t('menuDescription')}</SheetDescription>

        <div className={s.sheetBody}>
          <div className={s.sheetActions}>
            <AppSidebar
              channelsOpened={false}
              orientation="horizontal"
              showToggleChannels={false}
              onToggleChannels={() => undefined}
            />
          </div>

          <div className={s.sheetChannels}>
            <ChannelsPanel variant="drawer" onNavigate={close} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
