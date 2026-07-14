import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../../atoms';
import type { ComponentProps, ReactNode } from 'react';

type IconButtonWithTooltipProps = Omit<ComponentProps<typeof Button>, 'children'> & {
  // Icon JSX (lucide-react component / svg).
  icon: ReactNode;
  // Accessible name; also the tooltip body unless `tooltip` is provided.
  label: string;
  tooltip?: ReactNode;
  tooltipSide?: ComponentProps<typeof TooltipContent>['side'];
  tooltipSideOffset?: ComponentProps<typeof TooltipContent>['sideOffset'];
};

// Ghost icon-sized button with an attached tooltip — collapses the
// Tooltip+Trigger+Button+Content skeleton repeated across the sidebar.
export const IconButtonWithTooltip = ({
  icon,
  label,
  tooltip,
  tooltipSide = 'right',
  tooltipSideOffset = 6,
  size = 'icon',
  variant = 'ghost',
  ...buttonProps
}: IconButtonWithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={label} size={size} variant={variant} {...buttonProps}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={tooltipSideOffset}>
        {tooltip ?? label}
      </TooltipContent>
    </Tooltip>
  );
};
