import { clientBaseURL } from '../../config/cors';

export const withClientCallback = (url: string, path = '/'): string => {
  try {
    const parsed = new URL(url);

    parsed.searchParams.set('callbackURL', new URL(path, clientBaseURL).toString());

    return parsed.toString();
  } catch {
    return url;
  }
};
