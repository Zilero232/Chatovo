import {
  ScreenSharePresets,
  type TrackPublishDefaults,
  type VideoCaptureOptions,
  VideoPresets,
  type VideoResolution,
} from 'livekit-client';

import type { ScreenQuality, VideoQuality } from '../model/types';

const CAMERA_PRESETS: Record<VideoQuality, VideoResolution> = {
  '720p': VideoPresets.h720.resolution,
  '1080p': VideoPresets.h1080.resolution,
  '1440p': VideoPresets.h1440.resolution,
  '4k': VideoPresets.h2160.resolution,
};

const CAMERA_BITRATES: Record<VideoQuality, number> = {
  '720p': VideoPresets.h720.encoding.maxBitrate,
  '1080p': VideoPresets.h1080.encoding.maxBitrate,
  '1440p': VideoPresets.h1440.encoding.maxBitrate,
  '4k': VideoPresets.h2160.encoding.maxBitrate,
};

const SCREEN_PRESETS: Record<ScreenQuality, VideoResolution> = {
  '1080p15': ScreenSharePresets.h1080fps15.resolution,
  '1080p30': ScreenSharePresets.h1080fps30.resolution,
  '1440p30': VideoPresets.h1440.resolution,
  '4k30': VideoPresets.h2160.resolution,
};

const SCREEN_BITRATES: Record<ScreenQuality, number> = {
  '1080p15': ScreenSharePresets.h1080fps15.encoding.maxBitrate,
  '1080p30': ScreenSharePresets.h1080fps30.encoding.maxBitrate,
  '1440p30': VideoPresets.h1440.encoding.maxBitrate,
  '4k30': VideoPresets.h2160.encoding.maxBitrate,
};

export const getCameraCaptureOptions = (quality: VideoQuality): VideoCaptureOptions => ({
  resolution: CAMERA_PRESETS[quality],
});

export const getScreenCaptureOptions = (quality: ScreenQuality) => ({
  resolution: SCREEN_PRESETS[quality],
  contentHint: 'detail' as const,
});

export const getPublishDefaults = (
  cameraQuality: VideoQuality,
  screenQuality: ScreenQuality,
): TrackPublishDefaults => ({
  videoEncoding: {
    maxBitrate: CAMERA_BITRATES[cameraQuality],
    maxFramerate: CAMERA_PRESETS[cameraQuality].frameRate,
  },
  screenShareEncoding: {
    maxBitrate: SCREEN_BITRATES[screenQuality],
    maxFramerate: SCREEN_PRESETS[screenQuality].frameRate,
  },
});
