import { clamp } from 'remeda';

export const ARC_SIZE = 36;
export const ARC_RADIUS = 15;
export const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

export const readArcFill = ({ count, capacity }: { count: number; capacity: number }): number => {
  if (capacity <= 0) {
    return 0;
  }

  return clamp(count / capacity, { min: 0, max: 1 });
};
