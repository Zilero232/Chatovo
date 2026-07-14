import { clsx } from 'clsx';
import s from './Textarea.module.scss';
import type { TextareaProps } from './Textarea.types';

const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={clsx(s.root, className)} data-slot="textarea" {...props} />
);

export { Textarea };
