export type LandingHeroSpeaker = {
  id: string;
  initial: string;
  active: boolean;
};

export const LANDING_HERO_SPEAKERS: LandingHeroSpeaker[] = [
  { id: 'a', initial: 'A', active: true },
  { id: 'm', initial: 'M', active: true },
  { id: 'k', initial: 'K', active: false },
  { id: 'd', initial: 'D', active: true },
  { id: 's', initial: 'S', active: false },
];

export const LANDING_ACTIVE_SPEAKERS = LANDING_HERO_SPEAKERS.filter(
  (speaker) => speaker.active,
).length;
