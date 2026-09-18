'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { ChevronDown, FolderPlus, LogOut, Plus, Settings, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser } from '@/entities/auth/user';
import { canOnServer } from '@/entities/server/channel';
import { useCreateInvite } from '@/entities/server/invite';
import { useLeaveServer } from '@/entities/server/server';
import { CategoryDialog } from '@/features/server/manage-category';
import { ChannelDialog } from '@/features/server/manage-channel';
import { ServerSettingsDialog } from '@/features/server/settings';
import { ROUTES } from '@/shared/constants';
import { buildInviteHref, buildPublicAppUrl } from '@/shared/lib';
import {
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui-kit';

import type { ServerHeaderMenuProps } from './ServerHeaderMenu.types';

import s from '../ServerHeader/ServerHeader.module.scss';

type OpenDialog = 'category' | 'channel' | 'leave' | 'settings' | null;

export const ServerHeaderMenu = ({ server, serverId, tree }: ServerHeaderMenuProps) => {
  const router = useRouter();

  const t = useTranslations('server');
  const tCommon = useTranslations('common');
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const inviteMutation = useCreateInvite(serverId);
  const leaveMutation = useLeaveServer();
  const { copy } = useCopy();

  const [dialog, setDialog] = useState<OpenDialog>(null);

  const isOwner = user?.id === server.ownerId;
  const close = () => setDialog(null);

  const invite = () => {
    inviteMutation.mutate(
      {},
      {
        onSuccess: (created) => {
          copy(buildPublicAppUrl(buildInviteHref(created.code)));
          toast.success(t('invites.copied'), { id: `invite-${serverId}` });
        },
        onError: toastError(`invite-create-${serverId}`)
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={s.trigger} variant='ghost'>
          <span className={s.name}>{server.name}</span>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {canOnServer(tree, 'createInvite') && (
            <DropdownMenuItem onSelect={invite}>
              <UserPlus />
              {t('invites.create')}
            </DropdownMenuItem>
          )}
          {canOnServer(tree, 'manageServer') && (
            <DropdownMenuItem onSelect={() => setDialog('settings')}>
              <Settings />
              {t('settings.title')}
            </DropdownMenuItem>
          )}
          {canOnServer(tree, 'manageChannels') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setDialog('channel')}>
                <Plus />
                {t('channels.createChannel')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDialog('category')}>
                <FolderPlus />
                {t('channels.createCategory')}
              </DropdownMenuItem>
            </>
          )}
          {!isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onSelect={() => setDialog('leave')}>
                <LogOut />
                {t('settings.leave')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ServerSettingsDialog open={dialog === 'settings'} serverId={serverId} onOpenChange={close} />
      <ChannelDialog open={dialog === 'channel'} serverId={serverId} onOpenChange={close} />
      <CategoryDialog open={dialog === 'category'} serverId={serverId} onOpenChange={close} />
      <ConfirmDialog
        cancelLabel={tCommon('cancel')}
        confirmLabel={t('settings.leave')}
        description={t('settings.leaveConfirm', { name: server.name })}
        isPending={leaveMutation.isPending}
        open={dialog === 'leave'}
        title={t('settings.leave')}
        onConfirm={() =>
          leaveMutation.mutate(serverId, {
            onSuccess: () => {
              close();
              router.replace(ROUTES.lobby);
            },
            onError: toastError(`server-leave-${serverId}`)
          })
        }
        onOpenChange={close}
      />
    </>
  );
};
