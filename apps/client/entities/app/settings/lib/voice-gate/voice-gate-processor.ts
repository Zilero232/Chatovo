import type { AudioProcessorOptions, Track, TrackProcessor } from 'livekit-client';

export type VoiceGateParams = {
  autoSensitivity: boolean;
  threshold: number;
};

export const VOICE_GATE_MANUAL_RANGE = 0.5;

const FFT_SIZE = 1024;
const HANGOVER_MS = 250;
const ATTACK_TIME = 0.015;
const RELEASE_TIME = 0.15;
const NOISE_FLOOR_RISE = 0.0005;
const NOISE_FLOOR_FALL = 0.05;
const AUTO_MARGIN = 0.04;

const GATE_OPEN = 1;
const GATE_CLOSED = 0;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export class VoiceGateProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  name = 'voice-gate';

  processedTrack?: MediaStreamTrack;

  private params: VoiceGateParams;
  private onLevel?: (level: number, open: boolean) => void;

  private context?: AudioContext;
  private analyser?: AnalyserNode;
  private gain?: GainNode;
  private nodes: AudioNode[] = [];

  private readonly buffer = new Float32Array(FFT_SIZE);
  private rafId = 0;
  private openUntil = 0;
  private noiseFloor = 0;

  constructor(params: VoiceGateParams, onLevel?: (level: number, open: boolean) => void) {
    this.params = params;
    this.onLevel = onLevel;
  }

  async init(opts: AudioProcessorOptions) {
    this.start(opts.audioContext, opts.track);
  }

  async restart(opts: AudioProcessorOptions) {
    const context = opts.audioContext ?? this.context;

    await this.destroy();
    this.start(context, opts.track);
  }

  private start(context: AudioContext | undefined, track: MediaStreamTrack) {
    if (!context) {
      this.processedTrack = track;

      return;
    }

    this.buildGraph(context, track);
    this.tick();
  }

  async destroy() {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;

    for (const node of this.nodes) {
      node.disconnect();
    }

    this.nodes = [];
    this.context = undefined;
    this.analyser = undefined;
    this.gain = undefined;
    this.processedTrack = undefined;
    this.openUntil = 0;
    this.noiseFloor = 0;
  }

  update(params: VoiceGateParams) {
    this.params = params;
  }

  private buildGraph(context: AudioContext, track: MediaStreamTrack) {
    const source = context.createMediaStreamSource(new MediaStream([track]));

    const analyser = context.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.2;

    const gain = context.createGain();
    gain.gain.value = GATE_CLOSED;

    const destination = context.createMediaStreamDestination();

    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(destination);

    this.context = context;
    this.analyser = analyser;
    this.gain = gain;
    this.nodes = [source, analyser, gain];
    this.processedTrack = destination.stream.getAudioTracks()[0];
  }

  private measureLevel() {
    const analyser = this.analyser;
    if (!analyser) {
      return 0;
    }

    analyser.getFloatTimeDomainData(this.buffer);

    let sumOfSquares = 0;
    for (const sample of this.buffer) {
      sumOfSquares += sample * sample;
    }

    const rms = Math.sqrt(sumOfSquares / this.buffer.length);

    return clamp01(rms * 4);
  }

  private updateNoiseFloor(level: number) {
    const rate = level < this.noiseFloor ? NOISE_FLOOR_FALL : NOISE_FLOOR_RISE;
    this.noiseFloor += (level - this.noiseFloor) * rate;
  }

  private currentThreshold() {
    if (this.params.autoSensitivity) {
      return clamp01(this.noiseFloor + AUTO_MARGIN);
    }

    return clamp01(this.params.threshold) * VOICE_GATE_MANUAL_RANGE;
  }

  private isOpen(level: number, now: number) {
    if (level >= this.currentThreshold()) {
      this.openUntil = now + HANGOVER_MS / 1000;
    }

    return now < this.openUntil;
  }

  private applyGate(open: boolean, now: number) {
    if (!this.gain) {
      return;
    }

    const target = open ? GATE_OPEN : GATE_CLOSED;
    const speed = open ? ATTACK_TIME : RELEASE_TIME;

    this.gain.gain.setTargetAtTime(target, now, speed);
  }

  private tick = () => {
    if (!this.context) {
      return;
    }

    const now = this.context.currentTime;
    const level = this.measureLevel();

    this.updateNoiseFloor(level);

    const open = this.isOpen(level, now);

    this.applyGate(open, now);
    this.onLevel?.(level, open);

    this.rafId = requestAnimationFrame(this.tick);
  };
}
