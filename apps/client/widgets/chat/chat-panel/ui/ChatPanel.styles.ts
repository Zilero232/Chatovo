export const chatPanelStyles = {
  scrim:
    'fixed inset-0 z-30 bg-black/45 backdrop-blur-sm transition-opacity duration-300 md:hidden data-[open=false]:pointer-events-none data-[open=false]:opacity-0 data-[open=true]:animate-in data-[open=true]:fade-in',
  root: 'glass-strong absolute inset-0 z-40 flex w-full flex-col rounded-none border-0 border-white/10 border-l pb-safe shadow-[-28px_0_56px_-28px_oklch(0_0_0/0.85)] transition-transform duration-300 ease-out data-[open=false]:pointer-events-none data-[open=false]:translate-x-full data-[open=true]:translate-x-0 sm:left-auto sm:w-[clamp(28rem,40vw,46rem)] sm:pb-0',
} as const;
