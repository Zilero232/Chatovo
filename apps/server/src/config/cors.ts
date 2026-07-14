import { filter, map, pipe } from 'remeda';

import { env } from '../core';

// Web client origins come from env (comma-separated); Tauri origins are always
// allowed so the desktop app can reach the same API as the website.
// macOS/Linux Tauri webview uses `tauri://localhost`; Windows uses
// `http(s)://tauri.localhost` depending on the WebView2 build.
const TAURI_ORIGINS = [
  'tauri://localhost',
  'http://tauri.localhost',
  'https://tauri.localhost',
  'http://localhost',
  'https://localhost',
  'http://10.0.2.2:4000',
  'http://10.0.2.2:3000',
];

export const allowedOrigins = [
  ...pipe(
    env.CORS_ORIGINS.split(','),
    map((origin) => origin.trim()),
    filter((origin) => origin.length > 0),
  ),
  ...TAURI_ORIGINS,
];
