'use client';

import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { SecretClickArea } from '@/features/app/secret-games';
import { ROUTES } from '@/shared/constants';
import { BrandMark, Button, Sheet, SheetContent, SheetDescription, SheetTitle } from '@/ui-kit';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { ServerChannelsPanel } from '@/widgets/server/server-channels-panel';
import { ServerRail } from '@/widgets/server/server-rail';

import type { MobileNavProps } from './MobileNav.types';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const pathname = usePathname();

  const t = useTranslations('appSidebar');

  const close = () => onOpenChange(false);
  const isServerRoute = pathname === ROUTES.server;

  return (
    <div className={clsx('glass-strong', s.topBar)}>
      <div className={s.topBarInner}>
        <Sheet
          trigger={
            <Button
              aria-label={t('openMenu')}
              className={s.menuButton}
              size='icon'
              type='button'
              variant='ghost'
            >
              <Menu />
            </Button>
          }
          open={open}
          onOpenChange={onOpenChange}
        >
          <SheetContent
            className={s.sheet}
            modalClassName={s.sheetModal}
            showCloseButton={false}
            side='left'
          >
            <SheetTitle className={s.sheetTitleSr}>{t('menu')}</SheetTitle>
            <SheetDescription className={s.sheetTitleSr}>{t('menuDescription')}</SheetDescription>

            <div className={s.sheetBody}>
              <div className={s.sheetActions}>
                <ServerRail orientation='horizontal' onNavigate={close} />
              </div>

              <div className={s.sheetChannels}>
                {isServerRoute ? (
                  <ServerChannelsPanel variant='drawer' onNavigate={close} />
                ) : (
                  <ChannelsPanel variant='drawer' onNavigate={close} />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className={s.brand}>
          <SecretClickArea>
            <BrandMark glow size={28} />
          </SecretClickArea>
          <span className={s.brandTitle}>Chatovo</span>
        </div>

        <LanguageSwitcher />
      </div>
    </div>
  );
};
