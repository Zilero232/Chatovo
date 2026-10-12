import type { WebSocket } from 'ws';

import { describe, expect, it } from 'vitest';

import { hasActiveUserConnection, registerConnection } from '../connection-store';

const socket = () => ({}) as WebSocket;

describe('hasActiveUserConnection', () => {
  it('is false for a user without connections', () => {
    expect(hasActiveUserConnection('nobody')).toBe(false);
  });

  it('is false when every connection is in the background', () => {
    const connection = registerConnection('user-background', socket(), false);

    connection.isActive = false;

    expect(hasActiveUserConnection('user-background')).toBe(false);
  });

  it('is true when any connection is in the foreground', () => {
    const phone = registerConnection('user-mixed', socket(), false);

    phone.isActive = false;
    registerConnection('user-mixed', socket(), false);

    expect(hasActiveUserConnection('user-mixed')).toBe(true);
  });
});
