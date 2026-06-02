'use client';

import { useParams } from 'next/navigation';
import { first, isDefined } from 'remeda';

export const useRoomId = () => {
  const { slug } = useParams<{ slug?: string[] }>();

  const value = first(slug ?? []);

  return isDefined(value) ? decodeURIComponent(value) : null;
};
