'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LobbyRoomCard } from '../../../LobbyRoomCard';

import s from '../../LobbyRooms.module.scss';

import type { LobbyRoomsSectionsProps } from './LobbyRoomsSections.types';

export const LobbyRoomsSections = ({ sections }: LobbyRoomsSectionsProps) => {
  const tSections = useTranslations('room.sections');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={s.sections}>
      {sections.map((section, sectionIndex) => (
        <motion.section
          key={section.key}
          className={s.section}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 34,
            delay: shouldReduceMotion ? 0 : sectionIndex * 0.09,
          }}
        >
          <div className={s.sectionHeader}>
            <h4 className={s.sectionLabel}>{tSections(section.key)}</h4>
            <span className={s.sectionCount}>{section.rooms.length}</span>
            <span aria-hidden className={s.sectionRule} />
          </div>

          <div className={s.grid}>
            <AnimatePresence mode="popLayout">
              {section.rooms.map((room, roomIndex) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 34,
                    delay: shouldReduceMotion ? 0 : Math.min(roomIndex, 10) * 0.03,
                  }}
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
