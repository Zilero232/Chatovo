'use client';

import type { RefObject } from 'react';

import { formatRoleMention, formatUserMention } from '@chatovo/schemas';
import { useState } from 'react';

import { useServerMembers, useServerRoles } from '@/entities/server/member';

import type { MentionCandidate } from '../../ui/components/ChatComposer/components/ComposerMentionPopup/ComposerMentionPopup.types';

const MAX_CANDIDATES = 8;
const TRIGGER = /(^|\s)@([\w-]*)$/;

type UseMentionAutocompleteInput = {
  serverId: string | null;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
};

/** Discord-style `@` autocomplete: matches members and mentionable roles of the open server. */
export const useMentionAutocomplete = ({
  serverId,
  textareaRef,
  onChange
}: UseMentionAutocompleteInput) => {
  const { members } = useServerMembers(serverId);
  const { roles } = useServerRoles(serverId);

  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const needle = query?.toLowerCase() ?? '';

  const candidates: MentionCandidate[] =
    query === null
      ? []
      : [
          ...roles
            .filter((role) => role.mentionable && role.name.toLowerCase().includes(needle))
            .map((role) => ({
              id: role.id,
              kind: 'role' as const,
              label: role.isDefault ? `@${role.name}` : role.name,
              color: role.color
            })),
          ...members
            .filter((member) =>
              `${member.displayName} ${member.nickname ?? ''}`.toLowerCase().includes(needle)
            )
            .map((member) => ({
              id: member.userId,
              kind: 'user' as const,
              label: member.nickname ?? member.displayName,
              avatarUrl: member.avatarUrl
            }))
        ].slice(0, MAX_CANDIDATES);

  const sync = (value: string) => {
    const caret = textareaRef.current?.selectionStart ?? value.length;
    const match = TRIGGER.exec(value.slice(0, caret));

    setQuery(match ? (match[2] ?? '') : null);
    setActiveIndex(0);
  };

  const pick = (candidate: MentionCandidate) => {
    const element = textareaRef.current;
    const value = element?.value ?? '';
    const caret = element?.selectionStart ?? value.length;
    const head = value.slice(0, caret);
    const match = TRIGGER.exec(head);

    if (!match) {
      return;
    }

    const token =
      candidate.kind === 'role' ? formatRoleMention(candidate.id) : formatUserMention(candidate.id);
    const start = head.length - match[0].length + (match[1]?.length ?? 0);
    const next = `${value.slice(0, start)}${token} ${value.slice(caret)}`;

    onChange(next);
    setQuery(null);
    element?.focus();
  };

  const moveActive = (delta: number) => {
    setActiveIndex((current) => {
      const count = candidates.length;

      return count === 0 ? 0 : (current + delta + count) % count;
    });
  };

  return {
    candidates,
    activeIndex,
    isOpen: query !== null && candidates.length > 0,
    sync,
    pick,
    moveActive,
    close: () => setQuery(null)
  };
};
