export type MentionEntry = {
  color?: string | null;
  label: string;
};

export type MentionLookup = {
  roles: Map<string, MentionEntry>;
  users: Map<string, MentionEntry>;
};
