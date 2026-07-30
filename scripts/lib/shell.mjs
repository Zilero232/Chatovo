import { $ } from 'bun';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspace = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

export const isWindows = process.platform === 'win32';

$.cwd(workspace);
$.throws(true);

const write = (stream, scope, message) => {
  console[stream](`[${scope}] ${message}`);
};

export const reporter = (scope) => ({
  info: (message) => write('log', scope, message),
  step: (message) => write('log', scope, `→ ${message}`),
  warn: (message) => write('warn', scope, message),
  fail: (message, code = 1) => {
    write('error', scope, message);
    process.exit(code);
  }
});

const has = async (command) => {
  const result = await $`${isWindows ? 'where' : 'which'} ${command}`.nothrow().quiet();

  return result.exitCode === 0;
};

const resolveCommand = async ({ command, knownPaths }) => {
  if (await has(command)) {
    return command;
  }

  return knownPaths.find((path) => existsSync(path)) ?? null;
};

export const findGh = () =>
  resolveCommand({
    command: 'gh',
    knownPaths: [
      join(process.env.ProgramFiles ?? 'C:\\Program Files', 'GitHub CLI', 'gh.exe'),
      join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Links', 'gh.exe')
    ]
  });

export const requireGh = async (log) => {
  const gh = await findGh();

  if (!gh) {
    log.fail('gh not found — install the GitHub CLI, then run `gh auth login`');
  }

  return gh;
};

export { $ };
