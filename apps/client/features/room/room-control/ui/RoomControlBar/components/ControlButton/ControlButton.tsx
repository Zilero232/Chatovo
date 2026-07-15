'use client';

import { clsx } from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { Tooltip, TooltipContent } from '@/shared/ui';
import { DeviceMenu } from '../DeviceMenu';
import {
  controlButtonToneClass,
  controlMainToneClass,
  controlShellToneClass,
} from './control-button-tones';

import s from './ControlButton.module.scss';

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
  const shouldReduceMotion = useReducedMotion();

  const animatedIcon = (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={String(pressed)}
        className={s.iconSlot}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: 20 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      >
        {icon}
      </motion.span>
    </AnimatePresence>
  );
  if (!device) {
    return (
      <Tooltip>
        <button
          aria-label={label}
          aria-pressed={pressed}
          className={clsx(s.controlButton, controlButtonToneClass[tone])}
          disabled={disabled}
          type="button"
          onClick={onClick}
        >
          {animatedIcon}
        </button>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={clsx(s.controlShell, controlShellToneClass[tone])}>
      <Tooltip>
        <button
          aria-label={label}
          aria-pressed={pressed}
          className={clsx(s.controlMain, controlMainToneClass[tone])}
          disabled={disabled}
          type="button"
          onClick={onClick}
        >
          {animatedIcon}
        </button>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      <DeviceMenu kind={device.kind} label={device.label} slot={device.slot} />
    </div>
  );
};
