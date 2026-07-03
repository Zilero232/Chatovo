'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { DeviceMenu } from '../DeviceMenu';
import { controlButton, controlMain, controlShell } from './ControlButton.styles';
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
            className={controlButton({ tone })}
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
    <div className={controlShell({ tone })}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            aria-pressed={pressed}
            className={controlMain({ tone })}
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
