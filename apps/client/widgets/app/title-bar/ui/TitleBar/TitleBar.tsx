'use client';

import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useNavHistory } from '@/shared/hooks';
import { useWindowControls, useWindowPlatform } from '../../model/hooks';
import { TitleBarControls } from './components';

import s from './TitleBar.module.scss';

export const TitleBar = () => {
  const platform = useWindowPlatform();
  const { canGoBack, canGoForward, goBack, goForward } = useNavHistory();
  const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();

  if (!platform) {
    return null;
  }

  const isMacos = platform === 'macos';

  return (
    <div className={clsx(s.root, { [s.rootMacos]: isMacos })}>
      {!isMacos && (
        <div className={s.navButtons}>
          <button type="button" className={s.navButton} disabled={!canGoBack} onClick={goBack}>
            <ChevronLeft className={s.navIcon} />
          </button>
          <button
            type="button"
            className={s.navButton}
            disabled={!canGoForward}
            onClick={goForward}
          >
            <ChevronRight className={s.navIcon} />
          </button>
        </div>
      )}

      <div className={s.dragRegion} data-tauri-drag-region />

      {!isMacos && (
        <TitleBarControls
          isMaximized={isMaximized}
          onClose={close}
          onMinimize={minimize}
          onToggleMaximize={toggleMaximize}
        />
      )}
    </div>
  );
};
