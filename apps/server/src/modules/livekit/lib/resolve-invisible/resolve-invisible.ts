import type { ResolveInvisibleInput } from './resolve-invisible.types';

/**
 * Whether a token should join hidden. Only an admin may be invisible — the
 * client's `invisible` flag is meaningless without the server-verified role,
 * so a plain user who forges it is still visible.
 */
export const resolveInvisible = ({ requested, isAdmin }: ResolveInvisibleInput): boolean =>
  Boolean(requested) && isAdmin;
