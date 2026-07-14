'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { KIND_TO_SLOT, useAppSettings } from '@/entities/app/settings';
import { Select } from '@/shared/ui';

import type { SelectOption } from '@/shared/ui';

type DeviceSelectProps = {
  kind: MediaDeviceKind;
  emptyLabel?: string;
};

export const DeviceSelect = ({ kind, emptyLabel }: DeviceSelectProps) => {
  const t = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();
  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const slot = KIND_TO_SLOT[kind];
  const selectedId = settings.devices[slot];
  const selected = devices.find((device) => device.deviceId === selectedId);
  const activeId = selected?.deviceId ?? devices[0]?.deviceId ?? null;

  const options: SelectOption<string>[] = devices.map((device) => ({
    value: device.deviceId,
    label: device.label || t('unknownDevice'),
  }));

  const selectDevice = (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  };

  return (
    <Select
      isDisabled={isEmpty(devices)}
      options={options}
      placeholder={emptyLabel ?? t('noDevices')}
      value={activeId}
      onChange={selectDevice}
    />
  );
};
