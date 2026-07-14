'use client';

import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';
import { Button, GithubIcon, Tooltip, TooltipContent } from '@/shared/ui';

export const GithubButton = () => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <Button
        aria-label={t('githubLabel')}
        href={EXTERNAL_LINKS.repository}
        rel="noopener noreferrer"
        size="icon"
        target="_blank"
        variant="ghost"
      >
        <GithubIcon />
      </Button>
      <TooltipContent side="right">{t('github')}</TooltipContent>
    </Tooltip>
  );
};
