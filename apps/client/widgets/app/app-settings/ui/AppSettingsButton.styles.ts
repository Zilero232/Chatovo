export const appSettingsStyles = {
  // A flex column capped at viewport height: the header stays fixed while the
  // sidebar + active panel split the remaining space. Wider than the default
  // dialog (`sm:max-w-lg`) so the vertical tab sidebar fits comfortably.
  content: 'flex max-h-[calc(100dvh-2rem)] flex-col gap-4 p-4 sm:max-w-3xl sm:p-6',

  // Mobile: stack — horizontal scrollable tab pills on top, panel below.
  // Desktop (sm+): two columns — vertical tabs sidebar left, panel right.
  tabs: 'flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4',
  tabsList:
    'flex w-full shrink-0 flex-row items-stretch gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md sm:h-auto sm:w-48 sm:flex-col sm:self-start',
  tabsTrigger: 'flex-none shrink-0 justify-start gap-2 px-3 py-1.5 sm:w-full',
  tabsContent: 'min-w-0 flex-1',

  // The scrollable panel; -mr/pr keeps the scrollbar off the content edge.
  // Caps at viewport height on mobile so the dialog never blows past the screen.
  tabPanel:
    '-mr-2 flex max-h-[calc(100dvh-14rem)] flex-col gap-1 overflow-y-auto pr-2 pt-1 sm:max-h-[24rem]',

  // A labelled control row: text on the left, control on the right.
  row: 'flex items-center justify-between gap-4 py-2',
  rowText: 'flex min-w-0 flex-col gap-0.5',
  rowLabel: 'text-sm font-medium',
  rowHint: 'text-xs text-muted-foreground',

  // A row whose control sits below the label (sliders, device pickers).
  stackedRow: 'flex flex-col gap-2 py-2',

  deviceTrigger:
    'flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/8 disabled:opacity-50',
  deviceTriggerLabel: 'truncate text-left',
  deviceMenu: 'max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto',

  sliderRow: 'flex items-center gap-3',
  sliderValue: 'w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground',

  // Mic test: a live level bar next to the loopback toggle button.
  micTest: 'flex items-center gap-3',
  micTestBar: 'h-2 flex-1 overflow-hidden rounded-full bg-white/8 shadow-inner shadow-black/30',
  micTestFill:
    'h-full rounded-full bg-brand-cyan shadow-[0_0_8px_oklch(0.82_0.16_200/0.6)] transition-[width] duration-75',

  // Profile tab: own container with generous spacing — overrides the tight
  // tabPanel gap so the editor, its hints and the placeholder rows breathe.
  profilePanel: 'flex flex-col gap-6 pt-2',
  profileForm: 'flex flex-col gap-4',
  profileField: 'flex flex-col gap-2',
  profileLabel: 'font-medium text-sm',
  profileHint: 'text-muted-foreground text-xs',
  profileError: 'text-destructive text-xs',
  profileSubmit: 'self-start',
  profileSpinner: 'mr-1.5 size-4 animate-spin',
  // The "coming soon" placeholders, grouped with a small gap between them.
  profileSoon: 'flex flex-col gap-2',
  profileSoonRow:
    'flex items-center justify-between rounded-lg border border-dashed border-white/10 bg-white/3 px-3 py-2.5',
  profileSoonLabel: 'text-muted-foreground text-sm',
} as const;
