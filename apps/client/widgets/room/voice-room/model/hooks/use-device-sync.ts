'use client';

import { useRoomContext } from '@livekit/components-react';
import { LocalVideoTrack, type Room, RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { keys } from 'remeda';
import {
  type DeviceSettings,
  getCameraCaptureOptions,
  getPublishDefaults,
  KIND_TO_SLOT,
  useAppSettings,
} from '@/entities/app/settings';

const applyDevices = (room: Room, devices: DeviceSettings) => {
  for (const kind of keys(KIND_TO_SLOT)) {
    const deviceId = devices[KIND_TO_SLOT[kind]];

    if (deviceId) {
      room.switchActiveDevice(kind, deviceId);
    }
  }
};

const useApplyDevices = (room: Room, devices: DeviceSettings) => {
  useEffect(() => {
    if (room.state === 'connected') {
      applyDevices(room, devices);
    }

    const onConnected = () => {
      return applyDevices(room, devices);
    };
    room.on(RoomEvent.Connected, onConnected);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
    };
  }, [room, devices]);
};

const useMirrorActiveDevice = (room: Room) => {
  const { settings, setGroup } = useAppSettings();

  const devicesRef = useRef(settings.devices);
  devicesRef.current = settings.devices;

  const setGroupRef = useRef(setGroup);
  setGroupRef.current = setGroup;

  useEffect(() => {
    const onActiveDeviceChanged = (kind: MediaDeviceKind, deviceId: string) => {
      const slot = KIND_TO_SLOT[kind];
      if (devicesRef.current[slot] === deviceId) {
        return;
      }

      setGroupRef.current('devices', { [slot]: deviceId });
    };

    room.on(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);

    return () => {
      room.off(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);
    };
  }, [room]);
};

const useApplyAudioFlags = (room: Room) => {
  const { settings } = useAppSettings();
  const { audio } = settings;

  useEffect(() => {
    room.options.audioCaptureDefaults = {
      ...room.options.audioCaptureDefaults,
      ...audio,
    };

    if (room.localParticipant.isMicrophoneEnabled) {
      room.localParticipant.setMicrophoneEnabled(true, audio);
    }
  }, [room, audio]);
};

const useApplyVideoQuality = (room: Room) => {
  const { settings } = useAppSettings();
  const { cameraQuality, screenQuality } = settings.video;

  const mountedRef = useRef(false);

  useEffect(() => {
    room.options.publishDefaults = {
      ...room.options.publishDefaults,
      ...getPublishDefaults(cameraQuality, screenQuality),
    };

    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const cameraTrack = room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack;

    if (cameraTrack instanceof LocalVideoTrack) {
      cameraTrack.restartTrack(getCameraCaptureOptions(cameraQuality)).catch((err) => {
        console.error('failed to apply camera quality', err);
      });
    }
  }, [room, cameraQuality, screenQuality]);
};

export const useDeviceSync = () => {
  const room = useRoomContext();

  const { settings } = useAppSettings();

  useApplyAudioFlags(room);
  useApplyVideoQuality(room);
  useMirrorActiveDevice(room);
  useApplyDevices(room, settings.devices);
};
