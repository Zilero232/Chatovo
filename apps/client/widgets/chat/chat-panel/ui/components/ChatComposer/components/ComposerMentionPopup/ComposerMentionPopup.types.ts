export type MentionCandidate = {
  avatarUrl?: string | null;
  color?: string | null;
  id: string;
  kind: 'role' | 'user';
  label: string;
};

export type ComposerMentionPopupProps = {
  activeIndex: number;
  candidates: MentionCandidate[];
  onPick: (candidate: MentionCandidate) => void;
};
