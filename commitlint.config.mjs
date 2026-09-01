/**
 * Conventional Commits, enforced on commit-msg via husky.
 *
 * Deviations from @commitlint/config-conventional:
 *   - header-max-length 120 (default 100) — existing history has subjects up
 *     to 108 chars; a stricter limit would reject the established style.
 *   - scope stays free-form: the repo already uses app names (client, server,
 *     tauri), domains (auth, room, chat, social) and file-level scopes.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [0],
    'subject-case': [0]
  }
};
