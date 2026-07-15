import { Button, Spinner } from '../../atoms';

import type { SubmitButtonProps } from './SubmitButton.types';

export const SubmitButton = ({
  isPending = false,
  disabled,
  type = 'submit',
  children,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button disabled={disabled || isPending} type={type} {...props}>
      {isPending && <Spinner decorative />}
      {children}
    </Button>
  );
};
