'use client';

import { ROLE_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PermissionToggleList } from '@/entities/server/permission';
import {
  Button,
  ConfirmDialog,
  FormField,
  Input,
  Label,
  Row,
  Spinner,
  Stack,
  Switch
} from '@/ui-kit';

import type { RoleEditorProps } from './RoleEditor.types';

import s from './RoleEditor.module.scss';

const SWATCHES = [
  '#f04747',
  '#faa61a',
  '#43b581',
  '#1abc9c',
  '#3498db',
  '#9b59b6',
  '#e91e63',
  '#95a5a6'
];

export const RoleEditor = ({
  role,
  draft,
  isDirty,
  isSaving,
  onChange,
  onSave,
  onDelete
}: RoleEditorProps) => {
  const t = useTranslations('server.roles');
  const tCommon = useTranslations('common');

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Stack className={s.root} gap='3'>
      <Row align='center' gap='2' justify='between'>
        <span className={s.title}>{role.isDefault ? t('defaultRole') : role.name}</span>
        <Row gap='2'>
          {!role.isDefault && (
            <Button size='sm' type='button' variant='ghost' onClick={() => setConfirmDelete(true)}>
              {t('delete')}
            </Button>
          )}
          <Button disabled={!isDirty || isSaving} size='sm' type='button' onClick={onSave}>
            {isSaving && <Spinner decorative />}
            {tCommon('save')}
          </Button>
        </Row>
      </Row>

      {!role.isDefault && (
        <FormField htmlFor='role-name' label={t('nameLabel')}>
          <Input
            id='role-name'
            maxLength={ROLE_NAME_MAX_LENGTH}
            placeholder={t('namePlaceholder')}
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </FormField>
      )}

      <Stack gap='1'>
        <Label>{t('colorLabel')}</Label>
        <Row wrap gap='2'>
          <button
            aria-label='—'
            className={clsx(s.swatch, s.none, { [s.picked]: draft.color === null })}
            type='button'
            onClick={() => onChange({ color: null })}
          />
          {SWATCHES.map((color) => (
            <button
              key={color}
              aria-label={color}
              className={clsx(s.swatch, { [s.picked]: draft.color === color })}
              style={{ background: color }}
              type='button'
              onClick={() => onChange({ color })}
            />
          ))}
        </Row>
      </Stack>

      <Row align='center' gap='3' justify='between'>
        <Label htmlFor='role-hoist'>{t('hoistLabel')}</Label>
        <Switch
          checked={draft.hoist}
          id='role-hoist'
          onCheckedChange={(hoist) => onChange({ hoist })}
        />
      </Row>
      <Row align='center' gap='3' justify='between'>
        <Label htmlFor='role-mentionable'>{t('mentionableLabel')}</Label>
        <Switch
          checked={draft.mentionable}
          id='role-mentionable'
          onCheckedChange={(mentionable) => onChange({ mentionable })}
        />
      </Row>

      <PermissionToggleList
        disabled={isSaving}
        value={draft.permissions}
        onChange={(permissions) => onChange({ permissions })}
      />

      <ConfirmDialog
        cancelLabel={tCommon('cancel')}
        confirmLabel={t('delete')}
        description={t('deleteConfirm', { name: role.name })}
        isPending={isSaving}
        open={confirmDelete}
        title={t('delete')}
        onConfirm={() => {
          onDelete();
          setConfirmDelete(false);
        }}
        onOpenChange={setConfirmDelete}
      />
    </Stack>
  );
};
