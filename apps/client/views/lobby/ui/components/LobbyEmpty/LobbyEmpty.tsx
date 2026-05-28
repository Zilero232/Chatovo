'use client';

import { AudioLines } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CenteredState } from '@/shared/ui';

// Shown when no rooms exist yet — nudges the user toward the create button.
export const LobbyEmpty = () => {
  const t = useTranslations('lobby.empty');

  return (
    <CenteredState
      icon={<AudioLines className="size-6" />}
      title={t('title')}
      description={t('text')}
    />
  );
};
