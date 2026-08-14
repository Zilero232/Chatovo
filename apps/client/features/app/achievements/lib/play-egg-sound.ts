const EGG_SOUND_SRC = {
  achievement: '/audios/easter-eggs/achievement.ogg',
  unlock: '/audios/easter-eggs/unlock.ogg',
  fail: '/audios/easter-eggs/fail.ogg',
  secret: '/audios/easter-eggs/secret.ogg'
} as const;

export type EggSound = keyof typeof EGG_SOUND_SRC;

const cache = new Map<EggSound, HTMLAudioElement>();

export const playEggSound = (sound: EggSound, volume = 0.4) => {
  const cached = cache.get(sound);
  const audio = cached ?? new Audio(EGG_SOUND_SRC[sound]);

  if (!cached) {
    audio.preload = 'auto';
    cache.set(sound, audio);
  }

  audio.volume = volume;
  audio.currentTime = 0;

  audio.play().catch(() => {});
};
