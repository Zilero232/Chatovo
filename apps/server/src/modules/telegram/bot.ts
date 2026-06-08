import { Bot } from 'grammy';
import { env } from '../../core';
import type { FormattedString } from '@grammyjs/parse-mode';

const bot = env.TELEGRAM_BOT_TOKEN ? new Bot(env.TELEGRAM_BOT_TOKEN) : null;

export const send = async (message: FormattedString): Promise<void> => {
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
