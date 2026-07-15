'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { isTauriDesktop } from '@/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
} from '@/shared/ui';
import { SETTINGS_TABS } from '../config';

import s from './AppSettingsButton.module.scss';

import type { SettingsTabId } from '../config';

export const AppSettingsButton = () => {
  const t = useTranslations('settings');

  const { emailVerified, user } = useCurrentUser();

  const [isOpen, toggleOpen] = useBoolean(false);
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');

  const needsEmailVerification = Boolean(user && !emailVerified);
  const tabs = SETTINGS_TABS.filter((tab) => !tab.tauriDesktopOnly || isTauriDesktop());

  return (
    <>
      <Tooltip>
        <Button
          aria-label={t('open')}
          className={clsx({ [s.settingsButtonAlert]: needsEmailVerification })}
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => toggleOpen(true)}
        >
          <Settings />
          {needsEmailVerification && <span aria-hidden className={s.settingsAlertDot} />}
        </Button>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className={s.content}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <Tabs
            className={s.tabs}
            orientation="vertical"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as SettingsTabId)}
          >
            <TabsList className={s.tabsList}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} className={s.tabsTrigger} value={tab.id}>
                  {tab.icon}
                  {t(`tabs.${tab.id}`)}
                  {tab.id === 'security' && needsEmailVerification && (
                    <span aria-hidden className={s.tabAlertDot} />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} className={s.tabsContent} value={tab.id}>
                {tab.render({ jumpTo: setActiveTab })}
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
