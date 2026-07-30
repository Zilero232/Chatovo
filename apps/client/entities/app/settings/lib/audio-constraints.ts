import type { AudioSettings } from '../model/types';

type AudioCaptureFlags = Pick<
  AudioSettings,
  'autoGainControl' | 'echoCancellation' | 'noiseSuppression' | 'voiceIsolation'
>;

export const audioConstraints = (
  flags: AudioCaptureFlags,
  deviceId: string
): MediaTrackConstraints => ({
  noiseSuppression: flags.noiseSuppression,
  echoCancellation: flags.echoCancellation,
  autoGainControl: flags.autoGainControl,
  ...({ voiceIsolation: flags.voiceIsolation } as MediaTrackConstraints),
  ...(deviceId && { deviceId: { exact: deviceId } })
});
