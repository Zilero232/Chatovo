'use client';

import { PictureInPicture2 } from 'lucide-react';
import { useEffect } from 'react';
import DocumentPip from 'react-document-pip';
import { Button } from '@/shared/ui/atoms';
import type { ReactNode } from 'react';

const WINDOW_SIZE = { width: 320, height: 220 };

const isSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

type PictureInPictureProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  triggerLabel: string;
  triggerClassName?: string;
};

export const PictureInPicture = ({
  open,
  children,
  triggerLabel,
  triggerClassName,
  onOpenChange,
}: PictureInPictureProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onVisibilityChange = () => {
      if (!document.hidden) {
        onOpenChange(false);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [open, onOpenChange]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <Button
        aria-label={triggerLabel}
        className={triggerClassName}
        size="icon-lg"
        type="button"
        variant="ghost"
        onClick={() => onOpenChange(true)}
      >
        <PictureInPicture2 />
      </Button>

      <DocumentPip
        isPipOpen={open}
        mode="transfer-only"
        size={WINDOW_SIZE}
        onClose={() => onOpenChange(false)}
      >
        {children}
      </DocumentPip>
    </>
  );
};
