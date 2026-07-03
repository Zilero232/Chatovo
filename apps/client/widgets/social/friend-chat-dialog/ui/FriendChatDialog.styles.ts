export const friendChatDialogStyles = {
  content:
    'flex h-[min(42rem,85vh)] max-w-lg flex-col gap-0 overflow-hidden p-0 max-md:fixed max-md:inset-0 max-md:top-0 max-md:left-0 max-md:h-dvh max-md:max-h-none max-md:w-full max-md:max-w-none max-md:translate-none max-md:rounded-none max-md:border-0 max-md:pt-safe max-md:pb-safe',
  overlay: 'max-md:bg-background max-md:backdrop-blur-none',
  header:
    'flex shrink-0 items-center justify-between gap-3 border-b border-border py-3 inset-page-x sm:px-4',
  headerMain: 'flex min-w-0 flex-1 items-center gap-3',
  headerActions: 'flex shrink-0 items-center gap-0.5',
  name: 'min-w-0 truncate text-sm font-semibold',
  body: 'relative flex min-h-0 flex-1 flex-col',
  loading: 'flex flex-1 items-center justify-center',
} as const;
