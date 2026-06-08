import { bold, fmt } from '@grammyjs/parse-mode';
import { Bot } from 'grammy';
import { env, prisma } from '../../core';
import type { VoiceJoinNotification } from './types';

const bot = env.TELEGRAM_BOT_TOKEN ? new Bot(env.TELEGRAM_BOT_TOKEN) : null;

export const notifyVoiceJoin = async ({
  roomId,
  participantName,
}: VoiceJoinNotification): Promise<void> => {
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!bot || !chatId) {
    return;
  }

  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } });
  const roomName = room?.name ?? roomId;

  const message = fmt`🎙 ${bold()}${participantName}${bold()} зашёл в голосовой канал ${bold()}${roomName}${bold()}`;

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
