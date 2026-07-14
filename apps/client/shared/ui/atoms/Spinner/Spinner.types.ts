import type { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerProps = Omit<ComponentProps<typeof Loader2>, 'size'> & {
  size?: SpinnerSize;
};
