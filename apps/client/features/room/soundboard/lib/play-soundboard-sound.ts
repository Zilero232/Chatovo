import type { SoundboardSound } from '@chatovo/schemas';

import { SOUNDBOARD_SOUND_MAX_SECONDS, SOUNDBOARD_SOUND_SRC } from '../config/sounds';

const cache = new Map<SoundboardSound, HTMLAudioElement>();
const stopListeners = new Map<SoundboardSound, () => void>();

const armStop = (audio: HTMLAudioElement, sound: SoundboardSound) => {
  const previous = stopListeners.get(sound);

  if (previous) {
    audio.removeEventListener('timeupdate', previous);
  }

  const limit = SOUNDBOARD_SOUND_MAX_SECONDS[sound];

  const stopWhenElapsed = () => {
    if (audio.currentTime < limit) {
      return;
    }

    audio.pause();
    audio.removeEventListener('timeupdate', stopWhenElapsed);
    stopListeners.delete(sound);
  };

  stopListeners.set(sound, stopWhenElapsed);
  audio.addEventListener('timeupdate', stopWhenElapsed);
};

export const playSoundboardSound = (sound: SoundboardSound, volume = 0.6) => {
  const cached = cache.get(sound);
  const audio = cached ?? new Audio(SOUNDBOARD_SOUND_SRC[sound]);

  if (!cached) {
    audio.preload = 'auto';
    cache.set(sound, audio);
  }

  audio.volume = volume;
  audio.currentTime = 0;

  armStop(audio, sound);

  audio.play().catch(() => {});
};
