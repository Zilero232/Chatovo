import { Button, Spinner } from '../../atoms';
import type { ComponentProps, ReactNode } from 'react';

type SubmitButtonProps = ComponentProps<typeof Button> & {
  // Pending state — disables the button and renders the spinner before the label.
  isPending?: boolean;
  children: ReactNode;
};

// Submit-style button with a built-in pending spinner. Replaces the
// "Button + Loader2 + manual disabled flag" trio repeated across every form.
export const SubmitButton = ({
  isPending = false,
  disabled,
  type = 'submit',
  children,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button disabled={disabled || isPending} type={type} {...props}>
      {isPending && <Spinner />}
      {children}
    </Button>
  );
};
