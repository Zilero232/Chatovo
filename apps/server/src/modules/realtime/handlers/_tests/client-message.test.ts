import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RealtimeConnection } from '../../realtime.types';

const emitRoomEvent = vi.fn();
const patchParticipant = vi.fn();
const setConnectionRooms = vi.fn();
const filterAccessibleRooms = vi.fn();

vi.mock('../../emit', () => ({
  emitRoomEvent: (...args: unknown[]) => emitRoomEvent(...args)
}));

vi.mock('../../../livekit/presence', () => ({
  patchParticipant: (...args: unknown[]) => patchParticipant(...args)
}));

vi.mock('../../connection-store', () => ({
  setConnectionRooms: (...args: unknown[]) => setConnectionRooms(...args)
}));

vi.mock('../../../../lib', () => ({
  filterAccessibleRooms: (input: unknown) => filterAccessibleRooms(input)
}));

const { handleClientMessage } = await import('../client-message');

const ROOM_ID = '11111111-1111-4111-8111-111111111111';

const connectionOf = (isAdmin: boolean, rooms: string[]): RealtimeConnection =>
  ({
    id: 'connection-1',
    isAdmin,
    isAlive: true,
    rooms: new Set(rooms),
    userId: 'user-1',
    ws: {} as RealtimeConnection['ws']
  }) satisfies RealtimeConnection;

describe('handleClientMessage', () => {
  beforeEach(() => {
    emitRoomEvent.mockReset();
    patchParticipant.mockReset();
    setConnectionRooms.mockReset();
    filterAccessibleRooms.mockReset().mockResolvedValue([]);
  });

  it('broadcasts a soundboard sound sent by an admin', async () => {
    await handleClientMessage(
      connectionOf(true, [ROOM_ID]),
      JSON.stringify({ op: 'room.soundboard', roomId: ROOM_ID, sound: 'siren' })
    );

    expect(emitRoomEvent).toHaveBeenCalledWith(ROOM_ID, {
      type: 'room.soundboard',
      roomId: ROOM_ID,
      sound: 'siren',
      senderId: 'user-1'
    });
  });

  it('drops a soundboard sound sent by a regular user', async () => {
    await handleClientMessage(
      connectionOf(false, [ROOM_ID]),
      JSON.stringify({ op: 'room.soundboard', roomId: ROOM_ID, sound: 'siren' })
    );

    expect(emitRoomEvent).not.toHaveBeenCalled();
  });

  it('drops a soundboard sound aimed at a room the admin has not joined', async () => {
    await handleClientMessage(
      connectionOf(true, []),
      JSON.stringify({ op: 'room.soundboard', roomId: ROOM_ID, sound: 'siren' })
    );

    expect(emitRoomEvent).not.toHaveBeenCalled();
  });

  it('rejects a sound outside the allowed set', async () => {
    await handleClientMessage(
      connectionOf(true, [ROOM_ID]),
      JSON.stringify({ op: 'room.soundboard', roomId: ROOM_ID, sound: 'nuke' })
    );

    expect(emitRoomEvent).not.toHaveBeenCalled();
  });

  it('still broadcasts reactions from a regular user', async () => {
    await handleClientMessage(
      connectionOf(false, [ROOM_ID]),
      JSON.stringify({ op: 'room.reaction', roomId: ROOM_ID, emoji: '🔥' })
    );

    expect(emitRoomEvent).toHaveBeenCalledWith(ROOM_ID, {
      type: 'room.reaction',
      roomId: ROOM_ID,
      emoji: '🔥',
      senderId: 'user-1'
    });
  });

  it('ignores malformed payloads', async () => {
    await handleClientMessage(connectionOf(true, [ROOM_ID]), 'not json');

    expect(emitRoomEvent).not.toHaveBeenCalled();
    expect(patchParticipant).not.toHaveBeenCalled();
  });
});
