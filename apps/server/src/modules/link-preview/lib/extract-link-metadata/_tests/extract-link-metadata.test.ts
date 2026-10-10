import { describe, expect, it } from 'vitest';

import { extractLinkMetadata } from '../extract-link-metadata';

const PAGE_URL = 'https://www.example.com/articles/42';

const page = (head: string) => `<!doctype html><html><head>${head}</head><body></body></html>`;

describe('extractLinkMetadata', () => {
  it('reads the open graph tags', async () => {
    const html = page(`
      <meta property="og:title" content="Заголовок">
      <meta property="og:description" content="Описание статьи">
      <meta property="og:site_name" content="Example">
      <meta property="og:image" content="https://cdn.example.com/cover.jpg">
    `);

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toEqual({
      title: 'Заголовок',
      description: 'Описание статьи',
      siteName: 'Example',
      imageUrl: 'https://cdn.example.com/cover.jpg'
    });
  });

  it('falls back to twitter tags', async () => {
    const html = page(`
      <meta name="twitter:title" content="Tweet title">
      <meta name="twitter:image" content="https://cdn.example.com/t.png">
    `);

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toMatchObject({
      title: 'Tweet title',
      imageUrl: 'https://cdn.example.com/t.png'
    });
  });

  it('falls back to the document title and the bare hostname', async () => {
    const html = page('<title>  Plain   page </title>');

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toEqual({
      title: 'Plain page',
      description: null,
      siteName: 'example.com',
      imageUrl: null
    });
  });

  it('resolves a relative image against the page url', async () => {
    const html = page(
      '<meta property="og:title" content="T"><meta property="og:image" content="/img/a.png">'
    );

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toMatchObject({
      imageUrl: 'https://www.example.com/img/a.png'
    });
  });

  it('drops an image with a non-http scheme', async () => {
    const html = page(
      '<meta property="og:title" content="T"><meta property="og:image" content="javascript:alert(1)">'
    );

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toMatchObject({
      imageUrl: null
    });
  });

  it('decodes html entities', async () => {
    const html = page('<meta property="og:title" content="Tom &amp; Jerry &quot;live&quot;">');

    await expect(extractLinkMetadata({ html, url: PAGE_URL })).resolves.toMatchObject({
      title: 'Tom & Jerry "live"'
    });
  });

  it('truncates an oversized title to the schema limit', async () => {
    const html = page(`<meta property="og:title" content="${'a'.repeat(500)}">`);
    const metadata = await extractLinkMetadata({ html, url: PAGE_URL });

    expect(metadata?.title).toHaveLength(200);
  });

  it('returns null for a page with no title at all', async () => {
    await expect(extractLinkMetadata({ html: page(''), url: PAGE_URL })).resolves.toBeNull();
  });
});
