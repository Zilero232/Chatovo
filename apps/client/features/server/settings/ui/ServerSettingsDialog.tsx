'use client';

import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useServerById } from '@/entities/server/server';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/ui-kit';

import type { ServerSettingsDialogProps, ServerSettingsTab } from './ServerSettingsDialog.types';

import { BansTab, InvitesTab, MembersTab, OverviewTab, RolesTab } from './components';

import s from './ServerSettingsDialog.module.scss';

const TABS: ServerSettingsTab[] = ['overview', 'roles', 'members', 'bans', 'invites'];

export const ServerSettingsDialog = ({
  serverId,
  open,
  onOpenChange
}: ServerSettingsDialogProps) => {
  const t = useTranslations('server.settings');

  const { server } = useServerById(open ? serverId : null);

  const [tab, setTab] = useState<ServerSettingsTab>('overview');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Settings />} tone='violet'>
          <DialogTitle>{server ? `${t('title')} · ${server.name}` : t('title')}</DialogTitle>
        </DialogHeader>

        <Tabs
          className={s.tabs}
          value={tab}
          onValueChange={(next) => setTab(next as ServerSettingsTab)}
        >
          <TabsList>
            {TABS.map((value) => (
              <TabsTrigger key={value} value={value}>
                {t(value)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent className={s.panel} value='overview'>
            {server && <OverviewTab server={server} onClose={() => onOpenChange(false)} />}
          </TabsContent>
          <TabsContent className={s.panel} value='roles'>
            <RolesTab serverId={serverId} />
          </TabsContent>
          <TabsContent className={s.panel} value='members'>
            {server && <MembersTab server={server} />}
          </TabsContent>
          <TabsContent className={s.panel} value='bans'>
            <BansTab serverId={serverId} />
          </TabsContent>
          <TabsContent className={s.panel} value='invites'>
            <InvitesTab serverId={serverId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
