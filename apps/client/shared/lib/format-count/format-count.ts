const MAX_BADGE_COUNT = 99;

export const formatBadgeCount = (count: number) => {
  return count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);
};
