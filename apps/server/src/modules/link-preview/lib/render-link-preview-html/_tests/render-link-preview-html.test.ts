import { describe, expect, it } from 'vitest';

import { renderLinkPreviewHtml } from '../render-link-preview-html';

const PREVIEW = {
  title: 'Вечерний созвон',
  description: 'Сейчас в голосе: 2.',
  url: 'https://app.chatovo.ru/room?id=7a1f'
};

describe('renderLinkPreviewHtml', () => {
  it('renders a complete document', () => {
    const html = renderLinkPreviewHtml(PREVIEW);

    expect(html.startsWith('<!doctype html><html lang="ru">')).toBe(true);
    expect(html).toContain('<title>Вечерний созвон</title>');
  });

  it('puts the title, description and url into the open graph tags', () => {
    const html = renderLinkPreviewHtml(PREVIEW);

    expect(html).toContain('<meta content="Вечерний созвон" property="og:title"/>');
    expect(html).toContain('<meta content="Сейчас в голосе: 2." property="og:description"/>');
    expect(html).toContain(
      '<meta content="https://app.chatovo.ru/room?id=7a1f" property="og:url"/>'
    );
  });

  it('escapes a room name that tries to break out of the attribute', () => {
    const html = renderLinkPreviewHtml({ ...PREVIEW, title: '"><script>alert(1)</script>' });

    expect(html).not.toContain('<script>');
    expect(html).toContain('content="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"');
  });

  it('escapes ampersands in the url', () => {
    const html = renderLinkPreviewHtml({
      ...PREVIEW,
      url: 'https://app.chatovo.ru/room?id=1&view=chat'
    });

    expect(html).toContain('content="https://app.chatovo.ru/room?id=1&amp;view=chat"');
  });
});
