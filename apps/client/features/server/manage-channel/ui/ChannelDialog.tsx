'use client';

import { Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui-kit';

import type { ChannelDialogProps } from './ChannelDialog.types';

import { ChannelForm } from './components';

export const ChannelDialog = ({
  serverId,
  channel,
  categoryId,
  open,
  onOpenChange
}: ChannelDialogProps) => {
  const t = useTranslations('server.channels');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Hash />} tone='violet'>
          <DialogTitle>{channel ? t('editChannel') : t('createChannel')}</DialogTitle>
        </DialogHeader>

        <ChannelForm
          categoryId={categoryId}
          channel={channel}
          serverId={serverId}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
