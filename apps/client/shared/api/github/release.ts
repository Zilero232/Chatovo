import type { GitHubRelease } from './types';

const REPO = 'Zilero232/Chatovo';

export const getLatestRelease = async (): Promise<GitHubRelease> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!res.ok) throw new Error(`Failed to fetch latest release: ${res.status}`);

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('Failed to fetch latest release');
  }
};
