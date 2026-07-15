'use client';

import { clsx } from 'clsx';
import { Children, isValidElement, type ReactNode } from 'react';
import { Tabs as RACTabs, Tab, TabList, TabPanel, TabPanels } from 'react-aria-components';

import s from './Tabs.module.scss';

import type { Key } from '@react-types/shared';
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './Tabs.types';

const Tabs = ({
  className,
  value,
  defaultValue,
  onValueChange,
  selectedKey,
  onSelectionChange,
  children,
  ...props
}: TabsProps) => {
  const items = Children.toArray(children as ReactNode);
  const listItems = items.filter((child) => isValidElement(child) && child.type === TabsList);
  const panelItems = items.filter((child) => isValidElement(child) && child.type === TabsContent);
  const otherItems = items.filter(
    (child) => !(isValidElement(child) && (child.type === TabsList || child.type === TabsContent)),
  );

  const handleSelectionChange = (key: Key) => {
    onSelectionChange?.(key);
    onValueChange?.(key);
  };

  return (
    <RACTabs
      className={clsx(s.root, className)}
      data-slot="tabs"
      defaultSelectedKey={defaultValue}
      selectedKey={selectedKey ?? value}
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      {listItems}
      {panelItems.length > 0 ? (
        <TabPanels className={s.panels} data-slot="tabs-panels">
          {panelItems}
        </TabPanels>
      ) : null}
      {otherItems}
    </RACTabs>
  );
};

const TabsList = ({ className, ...props }: TabsListProps) => (
  <TabList className={clsx(s.list, className)} data-slot="tabs-list" {...props} />
);

const TabsTrigger = ({ className, value, id, ...props }: TabsTriggerProps) => (
  <Tab
    className={clsx(s.trigger, className)}
    data-slot="tabs-trigger"
    id={id ?? value}
    {...props}
  />
);

const TabsContent = ({ className, value, id, ...props }: TabsContentProps) => (
  <TabPanel
    className={clsx(s.content, className)}
    data-slot="tabs-content"
    id={id ?? value}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
