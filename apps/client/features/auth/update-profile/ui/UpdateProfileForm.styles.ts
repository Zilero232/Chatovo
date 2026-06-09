export const updateProfileFormStyles = {
  form: 'flex flex-col gap-4',
  field: 'flex flex-col gap-2',
  label: 'font-medium text-sm',
  hint: 'text-muted-foreground text-xs',
  error: 'text-destructive text-xs',
  submit: 'self-start',
  spinner: 'mr-1.5 size-4 animate-spin',

  avatarRow: 'flex items-center gap-4',
  avatarButton:
    'group/avatar-edit relative size-16 shrink-0 rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-brand-cyan',
  avatar: 'size-16!',
  avatarOverlay:
    'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/avatar-edit:opacity-100',
  avatarOverlayIcon: 'size-5 text-white',
  avatarMeta: 'flex flex-col gap-1',
  avatarRemove:
    'self-start text-destructive text-xs underline-offset-2 hover:underline disabled:opacity-50',

  bannerRow: 'flex flex-wrap items-center gap-2',
  bannerSwatch:
    'size-7 rounded-full border border-white/15 outline-hidden transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-50',
  bannerSwatchActive: 'ring-2 ring-white ring-offset-2 ring-offset-background',
  bannerCustomTrigger:
    'flex size-7 items-center justify-center rounded-full border border-white/30 border-dashed outline-hidden transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-50',
  bannerCustomIcon: 'size-3.5 text-white mix-blend-difference',
  bannerPickerPopover: 'w-auto p-3',
} as const;
