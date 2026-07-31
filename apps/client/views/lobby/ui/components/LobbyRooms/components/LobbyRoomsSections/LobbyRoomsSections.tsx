'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { LobbyRoomsSectionsProps } from './LobbyRoomsSections.types';

import { LobbyRoomCard } from '../../../LobbyRoomCard/LobbyRoomCard';
import {
  LOBBY_CARD_ANIMATE,
  LOBBY_CARD_EXIT,
  LOBBY_CARD_INITIAL,
  LOBBY_CARD_REDUCED,
  LOBBY_CARD_TRANSITION,
  LOBBY_SECTION_ANIMATE,
  LOBBY_SECTION_INITIAL,
  LOBBY_SECTION_REDUCED,
  LOBBY_SECTION_TRANSITION
} from './LobbyRoomsSections.motion';

import s from '../../LobbyRooms.module.scss';

export const LobbyRoomsSections = ({ sections }: LobbyRoomsSectionsProps) => {
  const tSections = useTranslations('room.sections');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={s.sections}>
      {sections.map((section, sectionIndex) => (
        <motion.section
          key={section.key}
          transition={{
            ...LOBBY_SECTION_TRANSITION,
            delay: shouldReduceMotion ? 0 : sectionIndex * 0.09
          }}
          animate={LOBBY_SECTION_ANIMATE}
          className={s.section}
          initial={shouldReduceMotion ? LOBBY_SECTION_REDUCED : LOBBY_SECTION_INITIAL}
        >
          <div className={s.sectionHeader}>
            <h4 className={s.sectionLabel}>{tSections(section.key)}</h4>
            <span className={s.sectionCount}>{section.rooms.length}</span>
            <span aria-hidden className={s.sectionRule} />
          </div>

          <div className={s.grid}>
            <AnimatePresence mode='popLayout'>
              {section.rooms.map((room, roomIndex) => (
                <motion.div
                  layout
                  key={room.id}
                  transition={{
                    ...LOBBY_CARD_TRANSITION,
                    delay: shouldReduceMotion ? 0 : Math.min(roomIndex, 10) * 0.03
                  }}
                  animate={LOBBY_CARD_ANIMATE}
                  exit={shouldReduceMotion ? LOBBY_CARD_REDUCED : LOBBY_CARD_EXIT}
                  initial={shouldReduceMotion ? LOBBY_CARD_REDUCED : LOBBY_CARD_INITIAL}
                >
                  <LobbyRoomCard room={room} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      ))}
    </div>
  );
};
