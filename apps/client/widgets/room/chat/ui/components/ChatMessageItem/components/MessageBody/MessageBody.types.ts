import type { ReactNode } from 'react';
import type { ChatLine } from '../../../../../model/types';

export type MessageBodyProps = {
  message: ChatLine;
  bubble: ReactNode;
  isDeleted: boolean;
  isEditing: boolean;
  onEdit: (id: string, body: string) => void;
  onStopEdit: () => void;
};
