import { cva } from 'class-variance-authority';

export const messageContentStyles = {
  root: '[overflow-wrap:anywhere] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p:last-child]:inline [&_h1]:mt-2 [&_h1]:mb-0.5 [&_h1]:font-semibold [&_h1]:text-base [&_h2]:mt-2 [&_h2]:mb-0.5 [&_h2]:font-semibold [&_h2]:text-[0.95rem] [&_h3]:mt-2 [&_h3]:mb-0.5 [&_h3]:font-semibold [&_h3]:text-sm [&_h4]:mt-2 [&_h4]:mb-0.5 [&_h4]:font-semibold [&_h4]:text-sm [&_h5]:mt-2 [&_h5]:mb-0.5 [&_h5]:font-semibold [&_h5]:text-sm [&_h6]:mt-2 [&_h6]:mb-0.5 [&_h6]:font-semibold [&_h6]:text-sm [&_li]:ml-4 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-1 [&_p]:my-0 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-1',
  code: 'rounded bg-black/30 px-1 py-0.5 font-mono text-[0.85em]',
  pre: 'rounded-lg bg-black/30 p-2 font-mono text-[0.85em]',
  edited: 'ml-1.5 align-baseline text-[10px] text-current/60 italic select-none',
} as const;

export const messageLink = cva('break-all underline-offset-2', {
  variants: {
    own: {
      true: 'font-medium text-white underline decoration-white/50 hover:decoration-white',
      false: 'text-brand-cyan hover:underline',
    },
  },
  defaultVariants: { own: false },
});
