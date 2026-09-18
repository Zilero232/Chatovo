import { bold, code, fmt, link } from '@grammyjs/parse-mode';

import type {
  AbuseReportNotification,
  ProblemReportNotification,
  UserBlockedNotification,
  UserSignupNotification,
  VoiceEmptyNotification,
  VoiceJoinNotification
} from './telegram.types';

import { send } from './bot';
import { roomUrl } from './links';

export const notifyVoiceJoin = ({
  roomId,
  roomName,
  participantName
}: VoiceJoinNotification): Promise<void> =>
  send(
    fmt`🎙 ${bold()}${participantName}${bold()} зашёл в голосовой канал ${link(roomUrl(roomId))}${roomName}${link(roomUrl(roomId))}`
  );

export const notifyVoiceEmpty = ({ roomName }: VoiceEmptyNotification): Promise<void> =>
  send(fmt`🔇 Голосовой канал ${bold()}${roomName}${bold()} опустел`);

export const notifyUserSignup = ({ name, email }: UserSignupNotification): Promise<void> =>
  send(fmt`✨ Новый пользователь: ${bold()}${name}${bold()} (${email})`);

export const notifyProblemReport = ({
  reporter,
  email,
  description,
  platform,
  appVersion
}: ProblemReportNotification): Promise<void> => {
  const trimmed = description.length > 500 ? `${description.slice(0, 500)}…` : description;
  const meta = [platform, appVersion].filter(Boolean).join(' · ');

  return send(
    fmt`🐞 Жалоба от ${bold()}${reporter}${bold()} (${email})${meta ? fmt` — ${meta}` : ''}\n\n${trimmed}`
  );
};

export const notifyAbuseReport = ({
  reporter,
  target,
  targetId,
  reason,
  comment,
  roomName
}: AbuseReportNotification): Promise<void> => {
  const trimmed = comment && comment.length > 500 ? `${comment.slice(0, 500)}…` : comment;
  const where = roomName ? fmt` в комнате ${bold()}${roomName}${bold()}` : '';

  return send(
    fmt`🚨 Жалоба на ${bold()}${target}${bold()} (${code()}${targetId}${code()})${where}\nПричина: ${bold()}${reason}${bold()}\nОт: ${reporter}${trimmed ? fmt`\n\n${trimmed}` : ''}`
  );
};

export const notifyUserBlocked = ({
  userName,
  email,
  reason,
  blockedBy
}: UserBlockedNotification): Promise<void> =>
  send(
    fmt`⛔ Заблокирован ${bold()}${userName}${bold()} (${email})\nПричина: ${reason}\nМодератор: ${code()}${blockedBy}${code()}`
  );
