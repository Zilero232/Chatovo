import type messages from './shared/i18n/locales/en.json';

declare module 'next-intl' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation requires an interface
  interface AppConfig {
    Messages: typeof messages;
  }
}
