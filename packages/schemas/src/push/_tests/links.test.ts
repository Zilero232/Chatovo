import { describe, expect, it } from 'vitest';

import { FRIEND_CHAT_QUERY_PARAM, PUSH_LINKS } from '../links';

describe('PUSH_LINKS.friendChat', () => {
  it('points the lobby at the friend through the chat parameter', () => {
    const url = new URL(PUSH_LINKS.friendChat('user 1'));

    expect(url.host).toBe('lobby');
    expect(url.searchParams.get(FRIEND_CHAT_QUERY_PARAM)).toBe('user 1');
  });
});
