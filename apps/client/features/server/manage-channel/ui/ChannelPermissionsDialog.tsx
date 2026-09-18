'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui-kit';

import type { ChannelPermissionsDialogProps } from './ChannelPermissionsDialog.types';

import { useOverwriteEditor } from '../model/hooks/use-overwrite-editor';
import { OverwriteEditor, OverwriteTargetList } from './components';

import s from './ChannelPermissionsDialog.module.scss';

export const ChannelPermissionsDialog = ({
  serverId,
  channel,
  open,
  onOpenChange
}: ChannelPermissionsDialogProps) => {
  const t = useTranslations('server.permissions');

  const editor = useOverwriteEditor({ serverId, channelId: channel.id });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Shield />} tone='cyan'>
          <DialogTitle>{`${t('groupGeneral')} · ${channel.name}`}</DialogTitle>
        </DialogHeader>

        <div className={s.body}>
          <OverwriteTargetList
            members={editor.members}
            overwrites={editor.overwrites}
            roles={editor.roles}
            selected={editor.target}
            onSelect={editor.select}
          />

          <OverwriteEditor
            allow={editor.allow}
            channelType={channel.type}
            deny={editor.deny}
            hasOverwrite={editor.hasOverwrite}
            isDirty={editor.isDirty}
            isSaving={editor.isSaving}
            target={editor.target}
            onChange={editor.setDraft}
            onRemove={editor.remove}
            onSave={editor.save}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
