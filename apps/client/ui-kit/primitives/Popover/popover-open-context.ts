'use client';

import { createContext, useContext } from 'react';

const PopoverOpenContext = createContext<boolean | null>(null);

export const PopoverOpenProvider = PopoverOpenContext.Provider;

/** Whether the closest `Popover` is open; `null` when the popup renders outside our wrapper. */
export const usePopoverOpen = () => useContext(PopoverOpenContext);
