'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';

import { useErrorMessage } from '@/entities/app/locale';
import { useRoomById, useRoomToken } from '@/entities/room/room';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

const VoiceRoom = dynamic(
  () => import('@/widgets/room/voice-room').then((m) => ({ default: m.VoiceRoom })),
  { ssr: false, loading: () => <RoomConnecting /> },
);

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations('room');
  const errorMessage = useErrorMessage();

  const roomId = params.get('id');
  const view = params.get('view');
  const titleOverride = params.get('title');

  const { room, isLoading, displayName, isPrivate, isDm } = useRoomById(roomId);

  const roomReady = isNonNullish(room);
  const roomTitle = titleOverride ?? displayName;

  const [password, setPassword] = useState<string>();

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken,
  } = useRoomToken(roomReady ? roomId : null, { isPrivate, password });

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on roomId change; router is a stable ref
  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);
    }
  }, [roomId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only when a public-room token fetch fails; router is a stable ref
  useEffect(() => {
    if (!isPrivate && tokenFailed) {
      router.replace(ROUTES.lobby);
    }
  }, [isPrivate, tokenFailed]);

  const submitPassword = (value: string) => {
    if (value === password) {
      return refetchToken();
    }

    setPassword(value);
  };

  return match({ roomId, isLoading, room, token })
    .with({ roomId: P.nullish }, () => null)
    .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
    .with({ room: P.nullish }, () => <RoomNotFound />)
    .with({ roomId: P.string, room: { isPrivate: true }, token: P.nullish }, () => (
      <RoomPasswordForm
        displayName={roomTitle}
        error={tokenFailed ? errorMessage(tokenError) : undefined}
        isSubmitting={tokenFetching}
        onSubmit={submitPassword}
      />
    ))
    .with({ token: P.nullish }, () => <RoomConnecting />)
    .with({ roomId: P.string, token: P.nonNullable, room: P.nonNullable }, ({ roomId, token }) => (
      <VoiceRoom
        key={roomId}
        initialChatOpen={view === 'chat'}
        isDm={isDm}
        roomId={roomId}
        roomName={roomTitle}
        serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        onConnectFailure={() => {
          toast.error(t('joinFailed'));

          setPassword(undefined);
          router.replace(ROUTES.lobby);
        }}
        onLeave={() => router.replace(ROUTES.lobby)}
      />
    ))
    .exhaustive();
};
