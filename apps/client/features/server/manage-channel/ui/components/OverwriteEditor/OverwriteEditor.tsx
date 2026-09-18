'use client';

import { useTranslations } from 'next-intl';

import { PermissionOverwriteList } from '@/entities/server/permission';
import { Button, CenteredState, Row, ScrollArea, Spinner, Text } from '@/ui-kit';

import type { OverwriteEditorProps } from './OverwriteEditor.types';

import s from './OverwriteEditor.module.scss';

export const OverwriteEditor = ({
  target,
  channelType,
  allow,
  deny,
  isDirty,
  hasOverwrite,
  isSaving,
  onChange,
  onSave,
  onRemove
}: OverwriteEditorProps) => {
  const t = useTranslations('server');
  const tCommon = useTranslations('common');

  if (!target) {
    return (
      <CenteredState
        description={t('permissions.inherit')}
        size='sm'
        title={t('permissions.groupGeneral')}
      />
    );
  }

  return (
    <div className={s.root}>
      <Row align='center' className={s.header} gap='2' justify='between'>
        <Text truncate weight='medium'>
          {target.label}
        </Text>
        <Row gap='2'>
          {hasOverwrite && (
            <Button disabled={isSaving} size='sm' type='button' variant='ghost' onClick={onRemove}>
              {tCommon('delete')}
            </Button>
          )}
          <Button disabled={!isDirty || isSaving} size='sm' type='button' onClick={onSave}>
            {isSaving && <Spinner decorative />}
            {tCommon('save')}
          </Button>
        </Row>
      </Row>

      <ScrollArea className={s.scroll}>
        <PermissionOverwriteList
          allow={allow}
          channelType={channelType}
          deny={deny}
          disabled={isSaving}
          onChange={onChange}
        />
      </ScrollArea>
    </div>
  );
};
