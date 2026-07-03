export const authedShellStyles = {
  root: 'flex h-full w-full flex-col overflow-hidden md:p-2',
  shell:
    'shell-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row md:rounded-2xl',
  desktopOnly: 'hidden h-full shrink-0 md:flex',
  content: 'min-h-0 min-w-0 flex-1 overflow-hidden',
} as const;
