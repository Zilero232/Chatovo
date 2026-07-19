'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { CreateRoomForm } from './components';

import type { CreateRoomDialogProps } from './CreateRoomDialog.types';

export const CreateRoomDialog = ({ trigger }: CreateRoomDialogProps) => {
  const t = useTranslations('createRoom');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={toggleOpen}
      trigger={
        trigger ?? (
          <Button type="button">
            <Plus />
            {t('trigger')}
          </Button>
        )
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <CreateRoomForm onCreated={() => toggleOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
