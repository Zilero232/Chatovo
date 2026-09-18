const USER_MENTION = /<@([\w-]+)>/g;
const ROLE_MENTION = /<@&([\w-]+)>/g;
const EVERYONE = /(?:^|\s)@everyone(?=$|[\s.,!?])/;

export type ParsedMentions = {
  everyone: boolean;
  roleIds: string[];
  userIds: string[];
};

/** Mentions are stored inline as `<@userId>` / `<@&roleId>` tokens plus the literal `@everyone`. */
export const parseMentions = (body: string): ParsedMentions => {
  const userIds = [...body.matchAll(USER_MENTION)].map((match) => match[1] ?? '');
  const roleIds = [...body.matchAll(ROLE_MENTION)].map((match) => match[1] ?? '');

  return {
    userIds: [...new Set(userIds)].filter((id) => id.length > 0),
    roleIds: [...new Set(roleIds)].filter((id) => id.length > 0),
    everyone: EVERYONE.test(body)
  };
};

export const formatUserMention = (userId: string) => `<@${userId}>`;

export const formatRoleMention = (roleId: string) => `<@&${roleId}>`;
