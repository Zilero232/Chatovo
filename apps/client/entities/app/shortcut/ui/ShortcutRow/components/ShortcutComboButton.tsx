'use client';

import { clsx } from 'clsx';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui';

import s from '../ShortcutRow.module.scss';

type ShortcutComboButtonProps = {
  display: string;
  label: string;
  recording: boolean;
  showConflictHint: boolean;
  onClick: () => void;
};

export const ShortcutComboButton = ({
  display,
  label,
  recording,
  showConflictHint,
  onClick,
}: ShortcutComboButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={showConflictHint ? undefined : false}>
        <TooltipTrigger>
          <Button
            aria-label={recording ? t('recording') : label}
            className={clsx(s.shortcutButton, showConflictHint && s.shortcutButtonConflict)}
            type="button"
            variant="outline"
            onClick={onClick}
          >
            {showConflictHint && <TriangleAlert aria-hidden className={s.warnIcon} />}
            <span>{display}</span>
          </Button>
        </TooltipTrigger>

        {showConflictHint && (
          <TooltipContent className={s.tooltip} side="top" sideOffset={6}>
            {t('errors.systemTaken')}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
