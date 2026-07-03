export type VoiceGateParams = {
  autoSensitivity: boolean;
  threshold: number;
};

export const VOICE_GATE_MANUAL_RANGE = 0.5;

export const VOICE_GATE_TICK_MS = 20;

const HANGOVER_MS = 280;
const NOISE_FLOOR_RISE = 0.06;
const NOISE_FLOOR_FALL = 0.015;
const AUTO_MARGIN = 0.025;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export class VoiceGateDetector {
  private openUntil = 0;
  private noiseFloor = 0;

  reset() {
    this.openUntil = 0;
    this.noiseFloor = 0;
  }

  isOpen(now = performance.now()) {
    return now < this.openUntil;
  }

  step(level: number, params: VoiceGateParams, now = performance.now()) {
    const rate = level < this.noiseFloor ? NOISE_FLOOR_FALL : NOISE_FLOOR_RISE;
    this.noiseFloor += (level - this.noiseFloor) * rate;

    const threshold = params.autoSensitivity
      ? clamp01(this.noiseFloor + AUTO_MARGIN)
      : clamp01(params.threshold) * VOICE_GATE_MANUAL_RANGE;

    if (level >= threshold) {
      this.openUntil = now + HANGOVER_MS;
    }

    return now < this.openUntil;
  }
}
