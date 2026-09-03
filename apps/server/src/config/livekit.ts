// Lifetime of the LiveKit AccessToken (room-join JWT) minted in the token
// handler. The grant only needs to be valid long enough to establish the
// connection — LiveKit keeps the participant in the room after the token
// expires, so 1 hour is a generous join window without long-lived credentials.
export const TOKEN_TTL_SECONDS = 60 * 60;

export const ROOM_GRANT_TTL_MS = 12 * 60 * 60 * 1000;
