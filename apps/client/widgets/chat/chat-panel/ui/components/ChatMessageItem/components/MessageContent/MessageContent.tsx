'use client';

import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { normalizeMessage } from '../../../../../model/lib';
import { messageLink, messageContentStyles as s } from './MessageContent.styles';
import type { Components } from 'react-markdown';
import type { MessageContentProps } from './MessageContent.types';

export const MessageContent = ({ message, isOwn, isEdited }: MessageContentProps) => {
  const t = useTranslations('chat');

  const components: Components = {
    a: ({ href, children }) => (
      <a
        className={messageLink({ own: isOwn })}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    ),
    code: ({ children }) => <code className={s.code}>{children}</code>,
    pre: ({ children }) => <pre className={s.pre}>{children}</pre>,
  };

  return (
    <div className={s.root}>
      <Markdown components={components} remarkPlugins={[remarkGfm, remarkBreaks]}>
        {normalizeMessage(message)}
      </Markdown>
      {isEdited && <span className={s.edited}>{t('edited')}</span>}
    </div>
  );
};
