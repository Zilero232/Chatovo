export const friendChatDialogStyles = {
  content: 'flex h-[min(42rem,85vh)] max-w-lg flex-col gap-0 overflow-hidden p-0',
  header: 'flex items-center justify-between gap-3 border-b border-border px-4 py-3',
  headerMain: 'flex min-w-0 flex-1 items-center gap-3',
  name: 'min-w-0 truncate text-sm font-semibold',
  body: 'relative flex min-h-0 flex-1 flex-col',
  loading: 'flex flex-1 items-center justify-center',
} as const;
