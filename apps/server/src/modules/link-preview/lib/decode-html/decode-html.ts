import { parse } from 'content-type';
import sniffHtmlEncoding from 'html-encoding-sniffer';
import iconv from 'iconv-lite';

import type { DecodeHtmlInput } from './decode-html.types';

import { LINK_UNFURL } from '../../config';

const parseContentType = (contentType: string) => {
  try {
    return parse(contentType);
  } catch {
    return null;
  }
};

export const decodeHtml = ({ body, contentType }: DecodeHtmlInput): string | null => {
  const parsed = parseContentType(contentType);

  if (parsed?.type && !LINK_UNFURL.htmlMimes.includes(parsed.type)) {
    return null;
  }

  const encoding = sniffHtmlEncoding(body, {
    transportLayerEncodingLabel: parsed?.parameters.charset,
    defaultEncoding: 'UTF-8'
  });

  return iconv.encodingExists(encoding) ? iconv.decode(body, encoding) : body.toString('utf8');
};
