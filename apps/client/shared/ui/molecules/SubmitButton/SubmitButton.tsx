import type { SubmitButtonProps } from './SubmitButton.types';

import { Button, Spinner } from '../../atoms';

export const SubmitButton = ({
  isPending = false,
  disabled,
  type = 'submit',
  children,
  ...props
}: SubmitButtonProps) => (
  <Button disabled={disabled || isPending} type={type} {...props}>
    {isPending && <Spinner decorative />}
    {children}
  </Button>
);
