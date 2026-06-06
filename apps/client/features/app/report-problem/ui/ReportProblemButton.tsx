'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Bug } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { ReportProblemDialog } from './ReportProblemDialog';

export const ReportProblemButton = () => {
  const t = useTranslations('feedback');

  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={t('title')}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleOpen(true)}
          >
            <Bug />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <ReportProblemDialog open={isOpen} onOpenChange={toggleOpen} />
    </>
  );
};
