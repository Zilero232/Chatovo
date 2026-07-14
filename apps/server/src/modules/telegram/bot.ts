import { Bot } from 'grammy';

import { env } from '../../core';

import type { FormattedString } from '@grammyjs/parse-mode';

const baseFetchConfig = env.TELEGRAM_PROXY_URL
  ? ({ proxy: env.TELEGRAM_PROXY_URL } as RequestInit)
  : undefined;

const bot = env.TELEGRAM_BOT_TOKEN
  ? new Bot(env.TELEGRAM_BOT_TOKEN, { client: { baseFetchConfig } })
  : null;

export const send = async (message: FormattedString): Promise<void> => {
  if (env.NODE_ENV === 'development') {
    // biome-ignore lint/suspicious/noConsole: dev-only notification stub
    console.info(`[telegram:dev] ${message.text}`);

    return;
  }

  const chatId = env.TELEGRAM_CHAT_ID;

  if (!bot || !chatId) {
    return;
  }

  try {
    await bot.api.sendMessage(chatId, message.text, {
      entities: message.entities,
      link_preview_options: { is_disabled: true },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    console.error(`Telegram sendMessage error: ${reason}`);
  }
};
