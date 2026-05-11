'use client';

import type { ChatMessage } from '../../model/types';
import { ChatFileMessage } from './ChatFileMessage';
import { ChatImageMessage } from './ChatImageMessage';
import { ChatTextMessage } from './ChatTextMessage';

type Props = {
  msg: ChatMessage;
};

export const ChatMessageBody = ({ msg }: Props) => {
  if (msg.type === 'text') return <ChatTextMessage body={msg.body} />;
  if (msg.mime.startsWith('image/')) return <ChatImageMessage url={msg.url} name={msg.name} />;
  return <ChatFileMessage url={msg.url} name={msg.name} size={msg.size} mime={msg.mime} />;
};
