import type { FriendEntry, Room } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { groupFriendsByPresence } from '../group-friends-by-presence';

const friendOf = (id: string, name: string, isOnline: boolean): FriendEntry =>
  ({ friendshipId: `f-${id}`, user: { id, name, isOnline } }) as FriendEntry;

const ROOMS = [{ id: 'room-1', name: 'Lobby' }] as Room[];

const PRESENCE = { 'room-1': [{ identity: 'busy' }] } as never;

describe('groupFriendsByPresence', () => {
  it('counts a friend sitting in a room as online even when presence says otherwise', () => {
    const { online, offline } = groupFriendsByPresence({
      friends: [friendOf('busy', 'Busy', false)],
      presence: PRESENCE,
      rooms: ROOMS
    });

    expect(online.map((entry) => entry.user.id)).toEqual(['busy']);
    expect(offline).toEqual([]);
  });

  it('separates offline friends from online ones', () => {
    const { online, offline } = groupFriendsByPresence({
      friends: [friendOf('a', 'Ann', true), friendOf('b', 'Bob', false)],
      presence: {} as never,
      rooms: ROOMS
    });

    expect(online.map((entry) => entry.user.id)).toEqual(['a']);
    expect(offline.map((entry) => entry.user.id)).toEqual(['b']);
  });

  it('maps a friend to the room they are in', () => {
    const { roomByUserId } = groupFriendsByPresence({
      friends: [friendOf('busy', 'Busy', true)],
      presence: PRESENCE,
      rooms: ROOMS
    });

    expect(roomByUserId.get('busy')).toEqual({ id: 'room-1', name: 'Lobby' });
  });

  it('ignores presence for a room that is no longer in the list', () => {
    const { roomByUserId } = groupFriendsByPresence({
      friends: [friendOf('busy', 'Busy', true)],
      presence: { 'gone-room': [{ identity: 'busy' }] } as never,
      rooms: ROOMS
    });

    expect(roomByUserId.size).toBe(0);
  });

  it('sorts each group by name so the list does not jump around', () => {
    const { online } = groupFriendsByPresence({
      friends: [friendOf('z', 'Zoe', true), friendOf('a', 'Ann', true)],
      presence: {} as never,
      rooms: ROOMS
    });

    expect(online.map((entry) => entry.user.name)).toEqual(['Ann', 'Zoe']);
  });

  it('handles an empty friend list', () => {
    const result = groupFriendsByPresence({ friends: [], presence: {} as never, rooms: ROOMS });

    expect(result.online).toEqual([]);
    expect(result.offline).toEqual([]);
  });
});
