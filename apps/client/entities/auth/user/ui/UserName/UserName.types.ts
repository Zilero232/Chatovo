export type UserNameSize = 'sm' | 'md';

export type UserNameProps = {
  name: string;
  verified?: boolean;
  profileUrl?: string | null;
  size?: UserNameSize;
  className?: string;
};
