'use client';

import { useState } from 'react';

import { DownloadAppDialog } from '@/features/app/download-app';
import { Button } from '@/ui-kit';

import type { LandingDownloadButtonProps } from './LandingDownloadButton.types';

export const LandingDownloadButton = ({ label }: LandingDownloadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size='lg' variant='outline' onClick={() => setIsOpen(true)}>
        {label}
      </Button>

      <DownloadAppDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
