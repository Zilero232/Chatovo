import { sumBy } from 'remeda';

type HomeHeroSpeaker = {
  active: boolean;
  id: string;
  initial: string;
};

export const HOME_HERO_SPEAKERS: HomeHeroSpeaker[] = [
  { id: 'a', initial: 'A', active: true },
  { id: 'm', initial: 'M', active: true },
  { id: 'k', initial: 'K', active: false },
  { id: 'd', initial: 'D', active: true },
  { id: 's', initial: 'S', active: false }
];

export const HOME_ACTIVE_SPEAKERS = sumBy(HOME_HERO_SPEAKERS, (speaker) => Number(speaker.active));
