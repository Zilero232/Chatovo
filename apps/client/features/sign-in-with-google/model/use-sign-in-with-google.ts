import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/shared/api';
import { ROUTES } from '@/shared/constants';

import { openPopup, waitForSignIn } from './popup';

export const useSignInWithGoogle = () =>
  useMutation({
    mutationFn: async () => {
      const popup = openPopup();

      // Start listening before the popup navigates — avoids a SIGNED_IN race.
      const signedIn = waitForSignIn(popup);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.auth}`,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        popup.close();
        throw error ?? new Error('Failed to start Google sign-in');
      }

      popup.location.href = data.url;

      return signedIn;
    },
  });
