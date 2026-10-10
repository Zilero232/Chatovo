import { IMAGE_REMOTE_HOSTS } from '@chatovo/schemas';
import { extname, resolve, sep } from 'node:path';

import type { ImageSource } from '../../images.types';
import type { ResolveImageSourceInput, ResolveUploadPathInput } from './resolve-image-source.types';

import { UPLOADS } from '../../../../config/uploads';
import { IMAGES } from '../../config';

const resolveUploadPath = ({ pathname, uploadsDir }: ResolveUploadPathInput): string | null => {
  try {
    const key = decodeURIComponent(pathname.slice(IMAGES.uploadsPathPrefix.length));

    const isImageFile = UPLOADS.inlineImageExtensions.has(extname(key).toLowerCase());

    if (!isImageFile || IMAGES.forbiddenKeyCharacters.test(key)) {
      return null;
    }

    const root = resolve(uploadsDir);
    const path = resolve(root, key);

    return path.startsWith(`${root}${sep}`) ? path : null;
  } catch {
    return null;
  }
};

export const resolveImageSource = ({
  url,
  filesOrigin,
  uploadsDir
}: ResolveImageSourceInput): ImageSource | null => {
  const source = URL.parse(url);
  const files = URL.parse(filesOrigin);

  if (!source || !files) {
    return null;
  }

  const { origin, pathname, protocol, hostname } = source;

  if (origin === files.origin && pathname.startsWith(IMAGES.uploadsPathPrefix)) {
    const path = resolveUploadPath({ pathname, uploadsDir });

    return path ? { kind: 'upload', path } : null;
  }

  if (protocol === 'https:' && IMAGE_REMOTE_HOSTS.includes(hostname)) {
    return { kind: 'remote', url: source.toString() };
  }

  return null;
};
