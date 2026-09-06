import type { MarketingNavItem } from '../MarketingHeaderNav/MarketingHeaderNav.types';

export type MarketingHeaderMobileNavProps = {
  items: MarketingNavItem[];
  localeSwitchHref: string;
  localeSwitchHrefLang: string;
  localeSwitchLabel: string;
  menuDescription: string;
  menuLabel: string;
  menuTitle: string;
};
