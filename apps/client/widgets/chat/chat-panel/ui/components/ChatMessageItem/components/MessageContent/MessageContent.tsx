'use client';

import type { Components } from 'react-markdown';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { useChatMessage } from '../../../../../model/contexts';
import { useMentionLookup } from '../../../../../model/hooks';
import { normalizeMessage, renderMentions } from '../../../../../model/lib';

import s from './MessageContent.module.scss';

export const MessageContent = () => {
  const t = useTranslations('chat');
  const { message, isEdited } = useChatMessage();

  const lookup = useMentionLookup();

  const renderText = (value: string) =>
    renderMentions(value, lookup, (label, kind, color) => (
      <span
        className={clsx(s.mention, { [s.mentionEveryone]: kind === 'everyone' })}
        style={color ? { color, borderColor: color } : undefined}
      >
        {label}
      </span>
    ));

  const components: Components = {
    a: ({ href, children }) => (
      <a className={s.link} href={href} rel='noopener noreferrer' target='_blank'>
        {children}
      </a>
    ),
    code: ({ children }) => <code className={s.code}>{children}</code>,
    pre: ({ children }) => <pre className={s.pre}>{children}</pre>,
    p: ({ children }) => (
      <p>
        {Array.isArray(children)
          ? children.map((child, index) =>
              typeof child === 'string' ? (
                // eslint-disable-next-line react/no-array-index-key -- markdown children keep a stable order
                <span key={index}>{renderText(child)}</span>
              ) : (
                child
              )
            )
          : typeof children === 'string'
            ? renderText(children)
            : children}
      </p>
    )
  };

  return (
    <div className={s.root}>
      <Markdown components={components} remarkPlugins={[remarkGfm, remarkBreaks]}>
        {normalizeMessage(message.message)}
      </Markdown>
      {isEdited && <span className={s.edited}>{t('edited')}</span>}
    </div>
  );
};
