'use client';

import { useCopy } from '@siberiacancode/reactuse';

import { buildRoomHref } from '@/shared/constants';
import { buildPublicAppUrl } from '@/shared/lib/app-url';

const COPIED_RESET_MS = 2000;

export const useCopyInviteLink = (roomId: string) => {
  const { copied, copy } = useCopy(COPIED_RESET_MS);

  const copyInviteLink = () => copy(buildPublicAppUrl(buildRoomHref(roomId)));

  return { copied, copyInviteLink };
};
