export const appSettingsStyles = {
  content:
    'flex max-h-dvh-safe flex-col gap-4 border-white/12 bg-shell-surface/95 p-4 backdrop-blur-xl sm:max-w-3xl sm:p-6',

  tabs: 'flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4',
  tabsList:
    'flex w-full shrink-0 flex-row items-stretch justify-start gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-md scrollbar-none sm:h-auto sm:w-48 sm:flex-col sm:self-start',
  tabsTrigger:
    'shrink-0 justify-start gap-2 px-3 py-1.5 data-[state=active]:bg-white/10 data-[state=active]:shadow-[0_0_16px_-6px_oklch(0.7_0.2_270/0.5)] sm:w-full',
  tabAlertDot: 'size-1.5 shrink-0 rounded-full bg-amber-400',
  settingsButtonAlert: 'relative',
  settingsAlertDot:
    'pointer-events-none absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-400 ring-2 ring-background',
  tabsContent:
    'min-w-0 flex-1 animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-200',

  tabPanel:
    '-mr-2 flex max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-14rem)] flex-col gap-1 overflow-y-auto pr-2 pt-1 sm:max-h-[24rem]',

  row: 'flex items-center justify-between gap-4 py-2',
  rowText: 'flex min-w-0 flex-col gap-0.5',
  rowLabel: 'text-sm font-medium',
  rowHint: 'text-xs text-muted-foreground',

  stackedRow: 'flex flex-col gap-2 py-2',

  deviceTrigger:
    'flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/8 disabled:opacity-50',
  deviceTriggerLabel: 'truncate text-left',
  deviceMenu: 'max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto',

  sliderRow: 'flex items-center gap-3',
  sliderValue: 'w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground',

  meterRow: 'flex items-center gap-3',
  meterTrack:
    'relative h-2 flex-1 grow overflow-hidden rounded-full bg-white/8 shadow-inner shadow-black/30',
  meterFill:
    'h-full rounded-full bg-white/25 transition-all duration-100 data-[open=true]:bg-emerald-400 data-[open=true]:shadow-[0_0_8px_oklch(0.82_0.18_150/0.6)]',

  sensitivitySlider:
    'relative flex w-full touch-none select-none items-center py-1.5 data-disabled:opacity-50',
  sensitivityThumb:
    'block h-4 w-1.5 shrink-0 rounded-full border border-white/80 bg-white shadow-[0_0_10px_-1px_oklch(1_0_0/0.7)] outline-none transition-transform hover:scale-y-110 focus-visible:ring-2 focus-visible:ring-white/50',

  profilePanel:
    '-mr-2 flex max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-14rem)] flex-col gap-6 overflow-y-auto pr-2 pt-2 sm:max-h-[24rem]',
  profileSection: 'flex flex-col gap-4',
  profileSectionTitle: 'font-semibold text-sm',
} as const;
