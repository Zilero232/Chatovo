import { match } from 'ts-pattern';

import type { MouseEvent } from 'react';
import type { MappedMenuItemHandlers, OverlayMenuItemHandlers } from './menu-types';

export const mapMenuItemHandlers = ({
  onSelect,
  onClick,
  closeOnClick,
}: OverlayMenuItemHandlers): MappedMenuItemHandlers => {
  const shouldCloseOnSelect = closeOnClick ?? true;

  return match(onSelect)
    .with(undefined, () => {
      return {
        onAction: onClick
          ? () => {
              onClick({} as MouseEvent<HTMLDivElement>);
            }
          : undefined,
        shouldCloseOnSelect,
      };
    })
    .otherwise((select) => {
      return {
        shouldCloseOnSelect,
        onAction: () => {
          let prevented = false;

          select({
            preventDefault: () => {
              prevented = true;
            },
          });

          if (!prevented) {
            onClick?.({} as MouseEvent<HTMLDivElement>);
          }
        },
      };
    });
};
