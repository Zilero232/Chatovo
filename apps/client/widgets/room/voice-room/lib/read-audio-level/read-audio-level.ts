import { clamp } from 'remeda';

import { LEVEL_GAIN, NOISE_FLOOR } from '../../config';

/** Reads one frame off the analyser and returns the speech level as 0..1, noise floor removed. */
export const readAudioLevel = (analyser: AnalyserNode, bins: Uint8Array<ArrayBuffer>): number => {
  analyser.getByteFrequencyData(bins);

  let sum = 0;

  for (const bin of bins) {
    sum += bin * bin;
  }

  const rms = Math.sqrt(sum / bins.length) / 255;

  return clamp((rms - NOISE_FLOOR) * LEVEL_GAIN, { min: 0, max: 1 });
};
