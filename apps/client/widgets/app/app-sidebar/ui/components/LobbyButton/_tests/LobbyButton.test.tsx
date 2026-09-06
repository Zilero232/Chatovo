import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const push = vi.fn();

let pathname = '/room';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => pathname
}));

const { LobbyButton } = await import('../LobbyButton');

const renderButton = (onNavigate?: () => void) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages} timeZone='UTC'>
      <LobbyButton onNavigate={onNavigate} />
    </NextIntlClientProvider>
  );

describe('LobbyButton', () => {
  beforeEach(() => {
    push.mockReset();
    pathname = '/room';
  });

  it('navigates client-side, so an open call survives the move', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: messages.appSidebar.lobby }));

    expect(push).toHaveBeenCalledWith('/lobby');
  });

  it('closes the mobile drawer it was opened from', async () => {
    const onNavigate = vi.fn();

    renderButton(onNavigate);

    await userEvent.click(screen.getByRole('button', { name: messages.appSidebar.lobby }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('marks itself as the current page while the lobby is open', () => {
    pathname = '/lobby';

    renderButton();

    const button = screen.getByRole('button', { name: messages.appSidebar.lobby });

    expect(button.getAttribute('aria-current')).toBe('page');
  });

  it('carries no current-page marker from another route', () => {
    renderButton();

    const button = screen.getByRole('button', { name: messages.appSidebar.lobby });

    expect(button.getAttribute('aria-current')).toBeNull();
  });
});
