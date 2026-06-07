'use client';

import { useConnectionState } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { ConnectionState } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PictureInPicture } from '@/shared/ui';
import { PipPanel } from './PipPanel';
import { roomPipStyles as s } from './PipPanel.styles';

export const RoomPip = () => {
  const t = useTranslations('room.pip');

  const isConnected = useConnectionState() === ConnectionState.Connected;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsOpen(false);
    }
  }, [isConnected]);

  if (isTauri()) {
    return null;
  }

  return (
    <PictureInPicture
      open={isOpen}
      triggerClassName={s.trigger}
      triggerLabel={t('popOut')}
      onOpenChange={setIsOpen}
    >
      <PipPanel />
    </PictureInPicture>
  );
};
