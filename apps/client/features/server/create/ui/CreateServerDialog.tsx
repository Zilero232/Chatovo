'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Plus, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/ui-kit';

import type { CreateServerDialogProps } from './CreateServerDialog.types';

import { CreateServerForm, CreateServerPurpose } from './components';

type Step = 'details' | 'purpose';

export const CreateServerDialog = ({ trigger }: CreateServerDialogProps) => {
  const t = useTranslations('server.create');

  const [isOpen, toggleOpen] = useBoolean(false);
  const [step, setStep] = useState<Step>('purpose');

  const close = () => {
    toggleOpen(false);
    setStep('purpose');
  };

  return (
    <Dialog
      trigger={
        trigger ?? (
          <Button type='button'>
            <Plus />
            {t('title')}
          </Button>
        )
      }
      open={isOpen}
      onOpenChange={(next) => (next ? toggleOpen(true) : close())}
    >
      <DialogContent>
        <DialogHeader icon={<Server />} tone='violet'>
          <DialogTitle>{step === 'purpose' ? t('purpose.title') : t('title')}</DialogTitle>
          <DialogDescription>
            {step === 'purpose' ? t('purpose.description') : t('description')}
          </DialogDescription>
        </DialogHeader>

        {step === 'purpose' ? (
          <CreateServerPurpose
            onPick={() => setStep('details')}
            onSkip={() => setStep('details')}
          />
        ) : (
          <CreateServerForm onBack={() => setStep('purpose')} onCreated={close} />
        )}
      </DialogContent>
    </Dialog>
  );
};
