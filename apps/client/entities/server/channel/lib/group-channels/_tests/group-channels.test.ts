import type { Category, Channel } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { groupChannels } from '../group-channels';

const channel = (overrides: Partial<Channel> & Pick<Channel, 'id' | 'position'>): Channel => ({
  serverId: 'server',
  categoryId: null,
  name: overrides.id,
  type: 'text',
  topic: null,
  slowMode: 0,
  nsfw: false,
  userLimit: null,
  isPrivate: false,
  archivedAt: null,
  ...overrides
});

const category = (id: string, position: number): Category => ({
  id,
  serverId: 'server',
  name: id,
  position
});

describe('groupChannels', () => {
  it('puts uncategorised channels first, then categories by position', () => {
    const groups = groupChannels({
      categories: [category('b', 1), category('a', 0)],
      channels: [
        channel({ id: 'loose', position: 0 }),
        channel({ id: 'in-b', position: 0, categoryId: 'b' }),
        channel({ id: 'in-a', position: 0, categoryId: 'a' })
      ]
    });

    expect(groups.map((group) => group.category?.id ?? null)).toEqual([null, 'a', 'b']);
  });

  it('sorts channels inside a category by position', () => {
    const groups = groupChannels({
      categories: [category('a', 0)],
      channels: [
        channel({ id: 'second', position: 2, categoryId: 'a' }),
        channel({ id: 'first', position: 1, categoryId: 'a' })
      ]
    });

    expect(groups[0]?.channels.map((item) => item.id)).toEqual(['first', 'second']);
  });

  it('omits the uncategorised group when every channel has a category', () => {
    const groups = groupChannels({
      categories: [category('a', 0)],
      channels: [channel({ id: 'only', position: 0, categoryId: 'a' })]
    });

    expect(groups).toHaveLength(1);
    expect(groups[0]?.category?.id).toBe('a');
  });
});
