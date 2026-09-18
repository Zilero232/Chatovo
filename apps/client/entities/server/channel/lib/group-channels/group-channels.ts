import type { Category, Channel } from '@chatovo/schemas';

import { sortBy } from 'remeda';

import type { ChannelGroup } from './group-channels.types';

/**
 * Lays the flat tree out the way the sidebar renders it: uncategorised channels
 * first, then each category with the channels it owns, both sorted by position.
 */
export const groupChannels = ({
  categories,
  channels
}: {
  categories: Category[];
  channels: Channel[];
}): ChannelGroup[] => {
  const byCategory = new Map<string, Channel[]>();
  const uncategorised: Channel[] = [];

  channels.forEach((channel) => {
    if (channel.categoryId === null) {
      uncategorised.push(channel);

      return;
    }

    byCategory.set(channel.categoryId, [...(byCategory.get(channel.categoryId) ?? []), channel]);
  });

  const sortedCategories = sortBy(categories, (category) => category.position);

  const groups: ChannelGroup[] = sortedCategories.map((category) => ({
    category,
    channels: sortBy(byCategory.get(category.id) ?? [], (channel) => channel.position)
  }));

  if (uncategorised.length === 0) {
    return groups;
  }

  return [
    { category: null, channels: sortBy(uncategorised, (channel) => channel.position) },
    ...groups
  ];
};
