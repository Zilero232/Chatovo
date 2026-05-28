export const chatPanelStyles = {
  root: 'glass-overlay fixed inset-y-2 right-2 z-40 flex w-full max-w-md flex-col rounded-2xl transition-transform duration-300 ease-out data-[open=false]:pointer-events-none data-[open=false]:translate-x-[105%] data-[open=true]:translate-x-0',
  scroll: 'min-h-0 flex-1 overflow-y-auto',
  list: 'flex flex-col gap-3 p-3',
} as const;
