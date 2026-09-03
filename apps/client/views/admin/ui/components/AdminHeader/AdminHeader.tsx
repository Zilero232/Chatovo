'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Row, Stack, Text } from '@/ui-kit';

import s from './AdminHeader.module.scss';

export const AdminHeader = () => {
  const t = useTranslations('admin');

  return (
    <Row align='center' className={s.root} gap='3'>
      <span className={s.badge}>
        <ShieldCheck className={s.icon} />
      </span>

      <Stack gap='1'>
        <Text as='h1' size='2xl' weight='semibold'>
          {t('title')}
        </Text>

        <Text size='sm' tone='muted'>
          {t('subtitle')}
        </Text>
      </Stack>
    </Row>
  );
};
