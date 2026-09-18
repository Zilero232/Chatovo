import type { ReactNode } from 'react';

import type { MentionLookup } from './render-mentions.types';

const TOKEN = /<@&?([\w-]+)>|(@everyone)/g;

/** Turns the stored `<@id>` / `<@&id>` / `@everyone` tokens into rendered chips. */
export const renderMentions = (
  body: string,
  lookup: MentionLookup,
  renderChip: (
    label: string,
    kind: 'everyone' | 'role' | 'user',
    color?: string | null
  ) => ReactNode
): ReactNode[] => {
  const nodes: ReactNode[] = [];

  let lastIndex = 0;
  let match = TOKEN.exec(body);
  let key = 0;

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(body.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(<span key={key}>{renderChip('@everyone', 'everyone')}</span>);
    } else {
      const id = match[1] ?? '';
      const isRole = match[0].startsWith('<@&');
      const entry = isRole ? lookup.roles.get(id) : lookup.users.get(id);

      nodes.push(
        <span key={key}>
          {renderChip(`@${entry?.label ?? id}`, isRole ? 'role' : 'user', entry?.color)}
        </span>
      );
    }

    key += 1;
    lastIndex = match.index + match[0].length;
    match = TOKEN.exec(body);
  }

  if (lastIndex < body.length) {
    nodes.push(body.slice(lastIndex));
  }

  return nodes;
};
