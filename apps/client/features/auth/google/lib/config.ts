export const POPUP_TIMEOUT_MS = 120_000;

export const POPUP_POLL_MS = 500;

export const POPUP_WIDTH = 480;
export const POPUP_HEIGHT = 640;

export const DEEP_LINK_SCHEME = 'chatovo';

export const DEEP_LINK_CALLBACK = `${DEEP_LINK_SCHEME}://auth/callback`;

// Tauri can't detect when the user closes the browser tab, so we time out the
// loading state after a minute rather than blocking the UI for two.
export const DEEP_LINK_TIMEOUT_MS = 60_000;
