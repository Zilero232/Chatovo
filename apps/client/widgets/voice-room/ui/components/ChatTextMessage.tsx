'use client';

import { Anchor, Text } from '@mantine/core';
import type { ReactNode } from 'react';

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

const linkify = (text: string): ReactNode[] => {
  const parts = text.split(URL_PATTERN);
  let offset = 0;
  return parts.map((part) => {
    const key = `${offset}-${part.length}`;
    offset += part.length;
    if (part.match(/^https?:\/\//)) {
      return (
        <Anchor href={part} key={key} target="_blank" rel="noreferrer" size="sm" c="indigo.4">
          {part}
        </Anchor>
      );
    }
    return <span key={key}>{part}</span>;
  });
};

type Props = {
  body: string;
};

export const ChatTextMessage = ({ body }: Props) => (
  <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} lh={1.5}>
    {linkify(body)}
  </Text>
);
