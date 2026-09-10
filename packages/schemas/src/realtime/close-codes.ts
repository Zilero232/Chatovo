/**
 * WebSocket close codes the server uses to end a connection deliberately.
 * `blocked` ends the account session for good — the client must stop reconnecting
 * and sign out. `roleChanged` only invalidates the current privileges, so the
 * client reconnects and refetches its session instead of logging the user out.
 */
export const WS_CLOSE_CODE = {
  blocked: 4403,
  roleChanged: 4404
} as const;

export const isSessionEndedCloseCode = (code: number): boolean => code === WS_CLOSE_CODE.blocked;

export const isPrivilegesChangedCloseCode = (code: number): boolean =>
  code === WS_CLOSE_CODE.roleChanged;
