'use client';

import { useEffect, useState } from 'react';

import { appEvents } from '@/shared/lib';

import type { SecretGamesHostProps } from './SecretGamesHost.types';

import { printConsoleGreeting } from '../../lib/console-greeting';
import { useKonamiCode } from '../../model/hooks/use-konami-code';
import { SnakeGame } from '../SnakeGame';

export const SecretGamesHost = ({ onKonami, onSecretOpen }: SecretGamesHostProps) => {
  const [isSnakeOpen, setIsSnakeOpen] = useState(false);

  useEffect(() => {
    printConsoleGreeting();
  }, []);

  useKonamiCode(() => {
    onKonami();
    setIsSnakeOpen(true);
  });

  appEvents.on.secretGameOpen(() => {
    onSecretOpen();
    setIsSnakeOpen(true);
  });

  return <SnakeGame isOpen={isSnakeOpen} onOpenChange={setIsSnakeOpen} />;
};
