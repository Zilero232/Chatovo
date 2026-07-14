import type { ComponentProps } from 'react';

export type AvatarSize = 'default' | 'lg' | 'sm';

export type AvatarProps = ComponentProps<'span'> & {
  size?: AvatarSize;
};

export type AvatarImageProps = ComponentProps<'img'>;

export type AvatarFallbackProps = ComponentProps<'span'>;

export type AvatarBadgeProps = ComponentProps<'span'>;

export type AvatarGroupProps = ComponentProps<'div'>;

export type AvatarGroupCountProps = ComponentProps<'div'>;
