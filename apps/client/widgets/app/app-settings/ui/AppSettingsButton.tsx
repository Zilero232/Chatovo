'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import {
  Keyboard,
  Mic,
  Settings,
  Settings2,
  ShieldCheck,
  User,
  Video,
  Volume2,
} from 'lucide-react';
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
  TooltipTrigger,
} from '@/shared/ui';
import { AudioTab } from './sections/AudioTab';
import { ProfileTab } from './sections/ProfileTab';
import { SecurityTab } from './sections/SecurityTab';
import { ShortcutsTab } from './sections/ShortcutsTab';
import { SoundsTab } from './sections/SoundsTab';
import { SystemTab } from './sections/SystemTab';
import { VideoTab } from './sections/VideoTab';

import s from './AppSettingsButton.module.scss';

import type { ReactNode } from 'react';

type TabId = 'profile' | 'audio' | 'video' | 'sounds' | 'system' | 'security' | 'shortcuts';

type TabConfig = {
  id: TabId;
  icon: ReactNode;
  tauriDesktopOnly?: boolean;
  render: (controls: { jumpTo: (id: TabId) => void }) => ReactNode;
};

const TABS: TabConfig[] = [
  { id: 'profile', icon: <User />, render: () => <ProfileTab /> },
  {
    id: 'audio',
    icon: <Mic />,
    render: ({ jumpTo }) => <AudioTab onJumpToShortcuts={() => jumpTo('shortcuts')} />,
  },
  { id: 'video', icon: <Video />, render: () => <VideoTab /> },
  { id: 'sounds', icon: <Volume2 />, render: () => <SoundsTab /> },
  { id: 'system', icon: <Settings2 />, tauriDesktopOnly: true, render: () => <SystemTab /> },
  { id: 'security', icon: <ShieldCheck />, render: () => <SecurityTab /> },
  { id: 'shortcuts', icon: <Keyboard />, tauriDesktopOnly: true, render: () => <ShortcutsTab /> },
];

export const AppSettingsButton = () => {
  const t = useTranslations('settings');

  const [isOpen, toggleOpen] = useBoolean(false);
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const { emailVerified, user } = useCurrentUser();
  const needsEmailVerification = Boolean(user && !emailVerified);

  const tabs = TABS.filter((tab) => !tab.tauriDesktopOnly || isTauriDesktop());

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button
            aria-label={t('open')}
            className={clsx(needsEmailVerification && s.settingsButtonAlert)}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleOpen(true)}
          >
            <Settings />
            {needsEmailVerification && <span aria-hidden className={s.settingsAlertDot} />}
          </Button>
        </TooltipTrigger>
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
            onValueChange={(value) => setActiveTab(value as TabId)}
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
