'use client';

import NumberFlow from '@number-flow/react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { LobbyRoomsSectionsProps } from './LobbyRoomsSections.types';

import { LobbyRoomCard } from '../../../LobbyRoomCard/LobbyRoomCard';
import {
  LOBBY_CARD_ANIMATE,
  LOBBY_CARD_EXIT,
  LOBBY_CARD_INITIAL,
  LOBBY_CARD_TRANSITION,
  LOBBY_SECTION_ANIMATE,
  LOBBY_SECTION_INITIAL,
  LOBBY_SECTION_TRANSITION
} from './LobbyRoomsSections.motion';

import s from '../../LobbyRooms.module.scss';

export const LobbyRoomsSections = ({ sections, view }: LobbyRoomsSectionsProps) => {
  const tSections = useTranslations('room.sections');

  return (
    <div className={s.sections}>
      {sections.map((section, sectionIndex) => (
        <motion.section
          key={section.key}
          transition={{
            ...LOBBY_SECTION_TRANSITION,
            delay: sectionIndex * 0.09
          }}
          animate={LOBBY_SECTION_ANIMATE}
          className={s.section}
          initial={LOBBY_SECTION_INITIAL}
        >
          <div className={s.sectionHeader}>
            <h4 className={s.sectionLabel}>{tSections(section.key)}</h4>
            <NumberFlow className={s.sectionCount} value={section.rooms.length} />
            <span aria-hidden className={s.sectionRule} />
          </div>

          <div className={s.grid} data-view={view}>
            <AnimatePresence mode='popLayout'>
              {section.rooms.map((room, roomIndex) => (
                <motion.div
                  key={room.id}
                  transition={{
                    ...LOBBY_CARD_TRANSITION,
                    delay: Math.min(roomIndex, 10) * 0.03
                  }}
                  animate={LOBBY_CARD_ANIMATE}
                  exit={LOBBY_CARD_EXIT}
                  initial={LOBBY_CARD_INITIAL}
                  layout='position'
                >
                  <LobbyRoomCard room={room} variant={view} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      ))}
    </div>
  );
};
