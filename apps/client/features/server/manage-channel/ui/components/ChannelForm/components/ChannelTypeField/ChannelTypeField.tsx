'use client';

import type { ChannelType } from '@chatovo/schemas';

import { channelTypeSchema } from '@chatovo/schemas';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { ChannelIcon } from '@/entities/server/channel';

import type { ChannelFieldsProps } from '../../ChannelForm.types';

import s from './ChannelTypeField.module.scss';

export const ChannelTypeField = ({ form }: ChannelFieldsProps) => {
  const t = useTranslations('server.channels');
  const tTypes = useTranslations('server.channelTypes');
  const tHints = useTranslations('server.channelTypeHints');

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('typeLabel')}</legend>

      <Controller
        render={({ field }) => (
          <div className={s.options}>
            {channelTypeSchema.options.map((option: ChannelType) => (
              <label
                key={option}
                className={clsx(s.option, { [s.picked]: field.value === option })}
              >
                <input
                  checked={field.value === option}
                  className={s.input}
                  name={field.name}
                  type='radio'
                  value={option}
                  onChange={() => field.onChange(option)}
                />

                <span aria-hidden className={s.radio} />

                <ChannelIcon className={s.icon} type={option} />

                <span className={s.text}>
                  <span className={s.name}>{tTypes(option)}</span>
                  <span className={s.hint}>{tHints(option)}</span>
                </span>
              </label>
            ))}
          </div>
        )}
        control={form.control}
        name='type'
      />
    </fieldset>
  );
};
