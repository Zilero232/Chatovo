import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../../atoms';

import type { IconButtonWithTooltipProps } from './IconButtonWithTooltip.types';

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
      <TooltipTrigger>
        <Button aria-label={label} size={size} variant={variant} {...buttonProps}>
          <span aria-hidden>{icon}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={tooltipSideOffset}>
        {tooltip ?? label}
      </TooltipContent>
    </Tooltip>
  );
};
