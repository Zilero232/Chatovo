'use client';

import { useFileDialog } from '@siberiacancode/reactuse';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useToastError } from '@/entities/app/locale';
import { useUpdateServerIcon } from '@/entities/server/server';
import { getAvatarColor, getInitials } from '@/shared/lib';
import { Button, Row, Spinner, Stack, Text } from '@/ui-kit';

import type { ServerIconFieldProps } from './ServerIconField.types';

import s from './ServerIconField.module.scss';

export const ServerIconField = ({ server }: ServerIconFieldProps) => {
  const t = useTranslations('server.settings');
  const toastError = useToastError();

  const iconMutation = useUpdateServerIcon(server.id);

  const { open } = useFileDialog(
    (files) => {
      const file = files?.[0];

      if (file) {
        iconMutation.mutate(file, { onError: toastError(`server-icon-${server.id}`) });
      }
    },
    { accept: 'image/*', multiple: false }
  );

  return (
    <Row align='center' gap='3'>
      <span
        style={
          server.iconUrl
            ? undefined
            : { background: server.bannerColor ?? getAvatarColor(server.name) }
        }
        className={s.preview}
      >
        {server.iconUrl ? (
          <img alt='' className={s.image} src={server.iconUrl} />
        ) : (
          getInitials(server.name)
        )}
      </span>

      <Stack gap='1'>
        <Row gap='2'>
          <Button disabled={iconMutation.isPending} size='sm' type='button' onClick={() => open()}>
            {iconMutation.isPending ? <Spinner decorative /> : <ImagePlus />}
            {t('uploadIcon')}
          </Button>

          {server.iconUrl && (
            <Button
              disabled={iconMutation.isPending}
              size='sm'
              type='button'
              variant='ghost'
              onClick={() => iconMutation.mutate(null, { onError: toastError('server-icon') })}
            >
              <Trash2 />
              {t('removeIcon')}
            </Button>
          )}
        </Row>

        <Text size='xs' tone='muted'>
          {t('iconHint')}
        </Text>
      </Stack>
    </Row>
  );
};
