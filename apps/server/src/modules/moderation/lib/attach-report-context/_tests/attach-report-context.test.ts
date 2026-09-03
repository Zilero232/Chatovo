import { describe, expect, it } from 'vitest';

import { collectReportRelatedIds } from '../attach-report-context';

const report = (over: Record<string, unknown>) =>
  ({
    id: 'r1',
    target: 'user',
    targetId: 'user-2',
    reason: 'spam',
    comment: null,
    roomId: null,
    reporterId: 'user-1',
    handled: false,
    handledAt: null,
    handledById: null,
    createdAt: new Date(),
    ...over
  }) as never;

describe('collectReportRelatedIds', () => {
  it('always collects the reporter', () => {
    expect(collectReportRelatedIds([report({})]).userIds).toContain('user-1');
  });

  it('collects the target of a user report as a user', () => {
    const { userIds, messageIds } = collectReportRelatedIds([report({})]);

    expect(userIds).toContain('user-2');
    expect(messageIds).toHaveLength(0);
  });

  it('routes a message target to messageIds, not userIds', () => {
    const ids = collectReportRelatedIds([report({ target: 'message', targetId: 'msg-1' })]);

    expect(ids.messageIds).toEqual(['msg-1']);
    expect(ids.userIds).toEqual(['user-1']);
  });

  it('routes a room target to roomIds', () => {
    expect(
      collectReportRelatedIds([report({ target: 'room', targetId: 'room-1' })]).roomIds
    ).toEqual(['room-1']);
  });

  it('picks up the context room alongside the target', () => {
    const ids = collectReportRelatedIds([
      report({ target: 'message', targetId: 'msg-1', roomId: 'room-9' })
    ]);

    expect(ids.roomIds).toEqual(['room-9']);
  });

  it('deduplicates ids across reports so one row is fetched once', () => {
    const ids = collectReportRelatedIds([
      report({ targetId: 'user-2' }),
      report({ id: 'r2', targetId: 'user-2' })
    ]);

    expect(ids.userIds).toEqual(['user-1', 'user-2']);
  });

  it('returns empty lists for no reports', () => {
    expect(collectReportRelatedIds([])).toEqual({ userIds: [], messageIds: [], roomIds: [] });
  });
});
