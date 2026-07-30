export type UserNameSize = 'md' | 'sm';

export type UserNameProps = {
  className?: string;
  name: string;
  profileUrl?: string | null;
  size?: UserNameSize;
  verified?: boolean;
};
