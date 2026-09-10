import { WS_CLOSE_CODE } from '@chatovo/schemas';

export const HEARTBEAT_INTERVAL_MS = 30_000;

export const BLOCKED_WS_CLOSE_CODE = WS_CLOSE_CODE.blocked;

export const ROLE_CHANGED_WS_CLOSE_CODE = WS_CLOSE_CODE.roleChanged;
