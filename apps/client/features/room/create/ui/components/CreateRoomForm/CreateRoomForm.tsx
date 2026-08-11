'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { useLiteMotion } from '@/shared/hooks';
import {
  FormField,
  Input,
  Label,
  PasswordInput,
  Row,
  Stack,
  SubmitButton,
  Switch,
  Text
} from '@/shared/ui';

import type { CreateRoomFormProps } from './CreateRoomForm.types';

import { useCreateRoomForm } from '../../../model/hooks';

import s from './CreateRoomForm.module.scss';

const NAME_MAX_LENGTH = 64;

export const CreateRoomForm = ({ hint, onCreated }: CreateRoomFormProps) => {
  const t = useTranslations('createRoom');
  const { resolveTransition } = useLiteMotion();

  const { form, isPrivate, name, isPending, canSubmit, onSubmit } = useCreateRoomForm({
    onCreated
  });
  const {
    control,
    formState: { errors },
    register
  } = form;

  return (
    <Stack as='form' gap='3' onSubmit={onSubmit}>
      <FormField
        label={
          <span className={s.labelRow}>
            {t('nameLabel')}
            <Text size='xs' tone='muted'>
              {t('nameCounter', { count: name?.length ?? 0, max: NAME_MAX_LENGTH })}
            </Text>
          </span>
        }
        error={errors.name?.message}
        htmlFor='create-room-name'
      >
        <Input
          autoComplete='off'
          id='create-room-name'
          maxLength={NAME_MAX_LENGTH}
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
      </FormField>

      <Stack className={s.privacyCard} gap='1'>
        <Row align='center' gap='3' justify='between'>
          <Label className={s.privacyLabel} htmlFor='create-room-private'>
            {t('privateLabel')}
          </Label>
          <Controller
            render={({ field }) => (
              <Switch
                checked={field.value}
                id='create-room-private'
                onCheckedChange={field.onChange}
              />
            )}
            control={control}
            name='isPrivate'
          />
        </Row>

        <Text size='xs' tone='muted'>
          {t(isPrivate ? 'privateExplainer' : 'publicExplainer')}
        </Text>
      </Stack>

      <AnimatePresence initial={false}>
        {isPrivate && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className={s.passwordReveal}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={resolveTransition({ type: 'spring', bounce: 0, duration: 0.32 })}
          >
            <FormField
              error={errors.password?.message}
              hint={t('passwordHint')}
              htmlFor='create-room-password'
              label={t('passwordLabel')}
            >
              <PasswordInput
                autoComplete='new-password'
                id='create-room-password'
                placeholder={t('passwordPlaceholder')}
                {...register('password')}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {hint}

      <SubmitButton disabled={!canSubmit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
