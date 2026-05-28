import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ReactNode } from 'react';

const rootVariants = cva(
  'flex min-h-full flex-1 flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'gap-2 px-4 py-6',
        md: 'gap-3 px-6 py-12',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const iconBoxVariants = cva(
  'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-12',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const titleVariants = cva('font-semibold', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-lg',
    },
  },
  defaultVariants: { size: 'md' },
});

type CenteredStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
} & VariantProps<typeof rootVariants>;

// Vertically centred icon + title + description + optional action — used for
// empty states (lobby with no rooms), error states (room not found), and
// loading screens (connecting...). `size="sm"` is the compact loading variant.
export const CenteredState = ({
  icon,
  title,
  description,
  action,
  size,
  className,
}: CenteredStateProps) => {
  return (
    <div className={cn(rootVariants({ size }), className)}>
      {icon && <div className={iconBoxVariants({ size })}>{icon}</div>}
      <h2 className={titleVariants({ size })}>{title}</h2>
      {description && <p className="max-w-sm text-muted-foreground text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
