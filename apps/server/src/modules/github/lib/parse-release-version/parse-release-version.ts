export const parseReleaseVersion = (tagName: string): string =>
  tagName.replace(/^(?:v|(?:desktop|mobile|web|app)-v)/i, '');
