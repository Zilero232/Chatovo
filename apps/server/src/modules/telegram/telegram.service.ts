import { bold, code, fmt, link } from '@grammyjs/parse-mode';

import { send } from './bot';
import { roomUrl } from './links';

import type {
  ProblemReportNotification,
  RoomCreatedNotification,
  RoomDeletedNotification,
  UserSignupNotification,
  VoiceEmptyNotification,
  VoiceJoinNotification,
} from './types';

export const notifyVoiceJoin = ({
  roomId,
  roomName,
  participantName,
}: VoiceJoinNotification): Promise<void> => {
  return send(
    fmt`🎙 ${bold()}${participantName}${bold()} зашёл в голосовой канал ${link(roomUrl(roomId))}${roomName}${link(roomUrl(roomId))}`,
  );
};

export const notifyVoiceEmpty = ({ roomName }: VoiceEmptyNotification): Promise<void> => {
  return send(fmt`🔇 Голосовой канал ${bold()}${roomName}${bold()} опустел`);
};

export const notifyUserSignup = ({ name, email }: UserSignupNotification): Promise<void> => {
  return send(fmt`✨ Новый пользователь: ${bold()}${name}${bold()} (${email})`);
};

export const notifyRoomCreated = ({
  roomName,
  ownerName,
  isPrivate,
  password,
}: RoomCreatedNotification): Promise<void> => {
  const badge = isPrivate ? '🔒 приватная' : '🌐 публичная';
  const passwordLine = isPrivate && password ? fmt`\nПароль: ${code()}${password}${code()}` : '';

  return send(
    fmt`➕ ${bold()}${ownerName}${bold()} создал комнату ${bold()}${roomName}${bold()} (${badge})${passwordLine}`,
  );
};

export const notifyRoomDeleted = ({
  roomName,
  ownerName,
}: RoomDeletedNotification): Promise<void> => {
  return send(fmt`➖ ${bold()}${ownerName}${bold()} удалил комнату ${bold()}${roomName}${bold()}`);
};

export const notifyProblemReport = ({
  reporter,
  email,
  description,
  platform,
  appVersion,
}: ProblemReportNotification): Promise<void> => {
  const trimmed = description.length > 500 ? `${description.slice(0, 500)}…` : description;
  const meta = [platform, appVersion].filter(Boolean).join(' · ');

  return send(
    fmt`🐞 Жалоба от ${bold()}${reporter}${bold()} (${email})${meta ? fmt` — ${meta}` : ''}\n\n${trimmed}`,
  );
};
