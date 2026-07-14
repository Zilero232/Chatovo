import type { Key } from '@react-types/shared';
import type { ReactNode } from 'react';
import type {
  TabsProps as RACTabsProps,
  TabListProps,
  TabPanelProps,
  TabProps,
} from 'react-aria-components';

export type TabsProps = Omit<
  RACTabsProps,
  'selectedKey' | 'onSelectionChange' | 'children' | 'defaultSelectedKey'
> & {
  value?: Key;
  defaultValue?: Key;
  onValueChange?: (value: Key) => void;
  selectedKey?: Key;
  onSelectionChange?: (key: Key) => void;
  children?: ReactNode;
};

export type TabsListProps = TabListProps<object>;

export type TabsTriggerProps = TabProps & {
  value?: Key;
};

export type TabsContentProps = TabPanelProps & {
  value?: Key;
};
