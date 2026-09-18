import type { ChatLine } from '../../../../../model/types';

export type ComposerReplyBarProps = {
  replyTo: ChatLine;
  onCancel: () => void;
};
