import { filter, map, pipe } from 'remeda';

import { env } from '../core';

const TAURI_ORIGINS = [
  'tauri://localhost',
  'http://tauri.localhost',
  'https://tauri.localhost',
  'http://localhost',
  'https://localhost',
  'http://10.0.2.2:4000',
  'http://10.0.2.2:3000',
];

const webOrigins = pipe(
  env.CORS_ORIGINS.split(','),
  map((origin) => origin.trim()),
  filter((origin) => origin.length > 0),
);

export const allowedOrigins = [...webOrigins, ...TAURI_ORIGINS];

export const clientBaseURL = webOrigins[0] ?? 'http://localhost:3000';
