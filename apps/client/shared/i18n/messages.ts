import type { Locale } from './config';

import en from './locales/en.json';
import ru from './locales/ru.json';

export type Messages = typeof en;

export const messages: Record<Locale, Messages> = { en, ru };
