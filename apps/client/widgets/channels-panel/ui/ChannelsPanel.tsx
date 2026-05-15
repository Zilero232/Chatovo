'use client';

import { channelsPanelStyles as s } from './ChannelsPanel.styles';
import { ChannelsFooter, ChannelsHeader, ChannelsList } from './components';

export const ChannelsPanel = () => (
  <div className={s.root}>
    <ChannelsHeader />
    <ChannelsList />
    <ChannelsFooter />
  </div>
);
