export type UserNameSize = 'md' | 'sm';

export type UserNameProps = {
  className?: string;
  color?: string | null;
  developer?: boolean;
  name: string;
  profileUrl?: string | null;
  size?: UserNameSize;
  verified?: boolean;
};
