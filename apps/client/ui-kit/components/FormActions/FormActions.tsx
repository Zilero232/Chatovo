'use client';

import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';

import type { FormActionsProps } from './FormActions.types';

import { Button } from '../../primitives';
import { DialogFooter } from '../../primitives/Dialog';
import { SubmitButton } from '../SubmitButton';

/** Dialog form footer: an optional cancel button next to the accent submit. */
export const FormActions = ({
  submitLabel,
  cancelLabel,
  isPending = false,
  isDisabled = false,
  submitVariant = 'primary',
  onCancel
}: FormActionsProps) => {
  const t = useTranslations('common');

  return (
    <DialogFooter>
      {isNonNullish(onCancel) && (
        <Button disabled={isPending} type='button' variant='outline' onClick={onCancel}>
          {cancelLabel ?? t('cancel')}
        </Button>
      )}

      <SubmitButton disabled={isDisabled} isPending={isPending} variant={submitVariant}>
        {submitLabel}
      </SubmitButton>
    </DialogFooter>
  );
};
