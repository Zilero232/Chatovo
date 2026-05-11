const PALETTE = [
  { from: 'indigo', to: 'violet' },
  { from: 'grape', to: 'pink' },
  { from: 'teal', to: 'cyan' },
  { from: 'orange', to: 'red' },
  { from: 'lime', to: 'teal' },
  { from: 'cyan', to: 'blue' },
  { from: 'pink', to: 'orange' },
  { from: 'violet', to: 'indigo' },
] as const;

export const gradientForIdentity = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash << 5) - hash + id.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};
