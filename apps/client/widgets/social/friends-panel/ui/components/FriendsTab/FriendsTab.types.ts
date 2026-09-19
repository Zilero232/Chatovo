export type FriendsTabProps = {
  countLabel: string;
  query: string;
  onlyOnline?: boolean;
};

export type RemoveTarget = { friendName: string; userId: string };
