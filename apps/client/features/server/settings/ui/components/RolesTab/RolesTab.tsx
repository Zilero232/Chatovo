'use client';

import { useTranslations } from 'next-intl';

import { useChannelPermissions } from '@/entities/server/channel';
import { Skeleton, Text } from '@/ui-kit';

import type { RolesTabProps } from './RolesTab.types';

import { useRoleEditor } from '../../../model/hooks';
import { RoleEditor } from '../RoleEditor/RoleEditor';
import { RoleList } from '../RoleList/RoleList';

import s from './RolesTab.module.scss';

export const RolesTab = ({ serverId }: RolesTabProps) => {
  const t = useTranslations('server.roles');

  const { can } = useChannelPermissions({ serverId, channelId: null });
  const editor = useRoleEditor(serverId);

  if (!can('manageRoles')) {
    return (
      <Text size='sm' tone='muted'>
        {t('noAccess')}
      </Text>
    );
  }

  if (editor.isLoading) {
    return <Skeleton className={s.skeleton} />;
  }

  return (
    <div className={s.root}>
      <RoleList
        roles={editor.roles}
        selectedId={editor.selected?.id ?? null}
        onCreate={editor.create}
        onMove={editor.move}
        onSelect={editor.select}
      />

      {editor.selected && editor.current && (
        <RoleEditor
          draft={editor.current}
          isDirty={editor.isDirty}
          isSaving={editor.isSaving}
          role={editor.selected}
          onChange={editor.patch}
          onDelete={editor.remove}
          onSave={editor.save}
        />
      )}
    </div>
  );
};
