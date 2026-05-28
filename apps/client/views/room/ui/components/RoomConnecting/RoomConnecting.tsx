'use client';

import { useTranslations } from 'next-intl';
import { CenteredState, Spinner } from '@/shared/ui';

// Rendered while the LiveKit access token is being fetched from the API.
// LiveKit-handshake state is handled separately by ConnectingOverlay inside
// VoiceRoom — see widgets/room/voice-room/ui/components/ConnectingOverlay.
export const RoomConnecting = () => {
  const t = useTranslations('room');

  return <CenteredState icon={<Spinner size="sm" />} size="sm" title={t('authorizing')} />;
};
