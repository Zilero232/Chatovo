'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useResolveReport } from '@/entities/app/admin';
import { useErrorMessage } from '@/entities/app/locale';
import { Badge, Button, Row, Stack, Text } from '@/ui-kit';

import type { ReportCardProps } from './ReportCard.types';

import { formatAdminDate, resolveReportTargetKey } from '../../../../../lib';

import s from './ReportCard.module.scss';

export const ReportCard = ({ report }: ReportCardProps) => {
  const t = useTranslations('admin');
  const tReason = useTranslations('moderation');
  const errorMessage = useErrorMessage();
  const { isPending, mutate } = useResolveReport();

  const subject = report.reportedUser?.name ?? report.roomName ?? report.targetId;

  const resolve = () =>
    mutate(report.id, {
      onSuccess: () => toast.success(t('reports.resolved'), { id: 'resolve-report' }),
      onError: (error: Error) => toast.error(errorMessage(error), { id: 'resolve-report' })
    });

  return (
    <Stack as='article' className={s.root} gap='2'>
      <Row wrap align='center' className={s.head} gap='2'>
        <Badge tone='danger'>{tReason(`reasons.${report.reason}`)}</Badge>
        <Text truncate size='sm' weight='medium'>
          {t(resolveReportTargetKey(report.target))}: {subject}
        </Text>
        <Text className={s.date} size='xs' tone='muted'>
          {formatAdminDate(report.createdAt)}
        </Text>
      </Row>

      {report.reportedMessage && (
        <blockquote className={s.quote}>{report.reportedMessage}</blockquote>
      )}

      <Text size='sm' tone={report.comment ? 'default' : 'muted'}>
        {report.comment ?? t('reports.noComment')}
      </Text>

      <Row wrap align='center' className={s.foot} gap='2'>
        <Text size='xs' tone='muted'>
          {t('reports.reporter')}: {report.reporter?.name ?? report.reporterId}
        </Text>

        {!report.handled && (
          <Button disabled={isPending} size='sm' variant='ghost' onClick={resolve}>
            <Check />
            {t('reports.resolve')}
          </Button>
        )}
      </Row>
    </Stack>
  );
};
