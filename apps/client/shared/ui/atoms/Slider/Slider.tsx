'use client';

import { Slider as BaseSlider } from '@base-ui-components/react/slider';
import { clsx } from 'clsx';

import s from './Slider.module.scss';

import type { SliderProps } from './Slider.types';

const Slider = ({ className, max, min, onValueChange, ...props }: SliderProps) => (
  <BaseSlider.Root
    className={clsx(s.root, className)}
    data-slot="slider"
    max={max}
    min={min}
    onValueChange={onValueChange}
    {...props}
  >
    <BaseSlider.Control className={s.control} data-slot="slider-control">
      <BaseSlider.Track className={s.track} data-slot="slider-track">
        <BaseSlider.Indicator className={s.indicator} data-slot="slider-range" />
        <BaseSlider.Thumb className={s.thumb} data-slot="slider-thumb" />
      </BaseSlider.Track>
    </BaseSlider.Control>
  </BaseSlider.Root>
);

export { Slider };
