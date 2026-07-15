'use client';

import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';

export const QueryFocusManager = () => {
  useEffect(() => {
    return focusManager.setEventListener((handleFocus) => {
      const onVisibilityChange = () => {
        handleFocus(document.visibilityState === 'visible');
      };

      document.addEventListener('visibilitychange', onVisibilityChange, false);
      window.addEventListener('focus', onVisibilityChange, false);

      return () => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('focus', onVisibilityChange);
      };
    });
  }, []);

  return null;
};
