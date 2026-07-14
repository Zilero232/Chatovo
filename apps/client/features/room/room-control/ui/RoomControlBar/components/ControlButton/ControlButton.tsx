'use client';

import { clsx } from 'clsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { DeviceMenu } from '../DeviceMenu';
import s from './ControlButton.module.scss';
import {
  controlButtonToneClass,
  controlMainToneClass,
  controlShellToneClass,
} from './control-button-tones';
import type { ControlButtonProps } from './ControlButton.types';

export const ControlButton = ({
  icon,
  label,
  tone,
  pressed,
  disabled,
  device,
  onClick,
}: ControlButtonProps) => {
  if (!device) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            aria-pressed={pressed}
            className={clsx(s.controlButton, controlButtonToneClass[tone])}
            disabled={disabled}
            type="button"
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={clsx(s.controlShell, controlShellToneClass[tone])}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            aria-pressed={pressed}
            className={clsx(s.controlMain, controlMainToneClass[tone])}
            disabled={disabled}
            type="button"
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      <DeviceMenu kind={device.kind} label={device.label} slot={device.slot} />
    </div>
  );
};
