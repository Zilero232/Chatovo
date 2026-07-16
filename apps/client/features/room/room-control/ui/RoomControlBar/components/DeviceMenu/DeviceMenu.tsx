'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { clsx } from 'clsx';
import { Check, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { isEmpty } from 'remeda';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { deviceErrorKey } from './lib/device-error-key';
import { deviceIcon } from './lib/device-icon';

import s from './DeviceMenu.module.scss';

import type { DeviceMenuProps } from './DeviceMenu.types';

export const DeviceMenu = ({ kind, slot, label }: DeviceMenuProps) => {
  const t = useTranslations('settings.devices');
  const { settings, setGroup } = useAppSettings();

  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
    onError: (error) => {
      toast.error(t(deviceErrorKey(error), { device: label }));
    },
  });

  const selectedId = settings.devices[slot];

  const availableIds = devices.map((device) => device.deviceId).filter((id) => !isEmpty(id));
  const [fallbackId] = availableIds;

  const resolvedId = [selectedId, activeDeviceId, fallbackId].find((deviceId) =>
    availableIds.includes(deviceId),
  );

  useEffect(() => {
    if (!resolvedId || resolvedId === selectedId) {
      return;
    }

    setGroup('devices', { [slot]: resolvedId });
  }, [resolvedId, selectedId, slot, setGroup]);

  const selectDevice = async (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });

    try {
      await setActiveMediaDevice(deviceId);
    } catch (error) {
      toast.error(t(deviceErrorKey(error as Error), { device: label }));
    }
  };

  const Icon = deviceIcon(kind);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={s.trigger} disabled={isEmpty(devices)}>
        <ChevronUp className={s.triggerIcon} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className={s.menu} side="top">
        <DropdownMenuGroup>
          <DropdownMenuLabel className={s.header}>
            <Icon className={s.headerIcon} />
            <span className={s.headerLabel}>{label}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuRadioGroup className={s.list} value={resolvedId} onValueChange={selectDevice}>
          {devices.map((device) => {
            const name = device.label || t('unknownDevice');
            const isActive = device.deviceId === resolvedId;

            return (
              <DropdownMenuRadioItem
                key={device.deviceId}
                className={clsx(s.item, { [s.itemActive]: isActive, [s.itemInactive]: !isActive })}
                value={device.deviceId}
              >
                <span className={clsx(s.itemIconBox, { [s.itemIconBoxActive]: isActive })}>
                  <Icon />
                </span>
                <span className={s.itemLabel} title={name}>
                  {name}
                </span>
                {isActive && <Check className={s.itemCheck} />}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
