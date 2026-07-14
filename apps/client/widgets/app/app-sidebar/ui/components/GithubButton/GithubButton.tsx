'use client';

import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';
import { Button, GithubIcon, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const GithubButton = () => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <TooltipTrigger>
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
      </TooltipTrigger>
      <TooltipContent side="right">{t('github')}</TooltipContent>
    </Tooltip>
  );
};
