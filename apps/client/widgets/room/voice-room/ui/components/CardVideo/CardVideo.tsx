'use client';

import { type TrackReference, useIsMuted, VideoTrack } from '@livekit/components-react';
import { clsx } from 'clsx';
import { Expand, Shrink } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useAppSettings } from '@/entities/app/settings';

import s from './CardVideo.module.scss';

import type { KeyboardEvent } from 'react';

type CardVideoProps = {
  trackRef: TrackReference;
};

export const CardVideo = ({ trackRef }: CardVideoProps) => {
  const muted = useIsMuted(trackRef);

  const { settings } = useAppSettings();

  const [isExpanded, setIsExpanded] = useState(false);

  const isMirrored = trackRef.participant.isLocal && settings.video.mirrorVideo;

  const videoClassName = clsx(s.video, { [s.videoMirrored]: isMirrored });
  const expandedVideoClassName = clsx(s.video, s.videoContain, {
    [s.videoMirrored]: isMirrored,
  });

  const toggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }

    if (event.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  if (muted) {
    return null;
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: <button> cannot wrap a <video>; div + role=button is the valid composite */}
      <div className={s.pane} role="button" tabIndex={0} onClick={toggle} onKeyDown={handleKeyDown}>
        <VideoTrack className={videoClassName} trackRef={trackRef} />
        <div className={s.fullscreenHint}>
          <Expand className={s.hintIcon} />
        </div>
      </div>

      {isExpanded &&
        createPortal(
          // biome-ignore lint/a11y/useSemanticElements: same composite pattern, rendered in a portal above the app
          <div
            className={s.overlay}
            role="button"
            tabIndex={0}
            onClick={toggle}
            onKeyDown={handleKeyDown}
          >
            <VideoTrack className={expandedVideoClassName} trackRef={trackRef} />
            <div className={s.fullscreenHint}>
              <Shrink className={s.hintIcon} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
