import { cva } from 'class-variance-authority';

import s from './MessageBubble.module.scss';

export const bubbleVariants = cva(s.bubble, {
  variants: {
    display: {
      bare: s.bare,
      padded: null
    }
  }
});
