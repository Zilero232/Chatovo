import { renderToStaticMarkup } from 'react-dom/server';
import { entries } from 'remeda';

import type { RenderLinkPreviewHtmlInput } from './render-link-preview-html.types';

import { LINK_PREVIEW } from '../../config';

export const renderLinkPreviewHtml = ({
  title,
  description,
  url
}: RenderLinkPreviewHtmlInput): string => {
  const { siteName } = LINK_PREVIEW;
  const { image } = LINK_PREVIEW.room;

  const openGraph = {
    'og:type': 'website',
    'og:site_name': siteName,
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image.url,
    'og:image:width': String(image.width),
    'og:image:height': String(image.height)
  };

  const twitter = {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image.url
  };

  const markup = renderToStaticMarkup(
    <html lang='ru'>
      <head>
        <meta charSet='utf-8' />
        <title>{title}</title>
        <meta content={description} name='description' />
        {entries(openGraph).map(([property, content]) => (
          <meta key={property} content={content} property={property} />
        ))}
        {entries(twitter).map(([name, content]) => (
          <meta key={name} content={content} name={name} />
        ))}
      </head>
      <body>
        <a href={url}>{title}</a>
      </body>
    </html>
  );

  return `<!doctype html>${markup}`;
};
