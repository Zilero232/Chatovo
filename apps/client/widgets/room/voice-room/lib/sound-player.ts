import { SOUND_SRC, type SoundKey } from '../config';

export type SoundPlayer = {
  play: (key: SoundKey, volume: number) => void;
  dispose: () => void;
};

export const createSoundPlayer = (): SoundPlayer => {
  const cache = new Map<SoundKey, HTMLAudioElement>();

  const get = (key: SoundKey) => {
    const cached = cache.get(key);

    if (cached) {
      return cached;
    }

    const audio = new Audio(SOUND_SRC[key]);
    audio.preload = 'auto';
    cache.set(key, audio);

    return audio;
  };

  return {
    play: (key, volume) => {
      const audio = get(key);

      audio.volume = volume;
      audio.currentTime = 0;

      audio.play().catch(() => {});
    },
    dispose: () => {
      for (const audio of cache.values()) {
        audio.pause();
        audio.src = '';
      }

      cache.clear();
    },
  };
};
