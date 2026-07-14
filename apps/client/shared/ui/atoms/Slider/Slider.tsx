'use client';

import { clsx } from 'clsx';
import { Slider as RACSlider, SliderFill, SliderThumb, SliderTrack } from 'react-aria-components';
import s from './Slider.module.scss';
import type { SliderProps } from './Slider.types';

const Slider = ({
  className,
  max,
  min,
  maxValue,
  minValue,
  onValueChange,
  onChange,
  ...props
}: SliderProps) => (
  <RACSlider
    className={clsx(s.root, className)}
    data-slot="slider"
    maxValue={maxValue ?? max}
    minValue={minValue ?? min}
    onChange={(value) => {
      onChange?.(value);
      onValueChange?.(value);
    }}
    {...props}
  >
    <SliderTrack className={s.track} data-slot="slider-track">
      <SliderFill className={s.indicator} data-slot="slider-range" />
      <SliderThumb className={s.thumb} data-slot="slider-thumb" />
    </SliderTrack>
  </RACSlider>
);

export { Slider };
