import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, oneTimeToken } from 'better-auth/plugins';
import { createElement } from 'react';
import { allowedOrigins } from '../../config/cors';
import { env, prisma } from '../../core';
import { ChangeEmail, ResetPassword, sendEmail, VerifyEmail } from '../email';
import { notifyUserSignup } from '../telegram';

export type UserRole = 'admin' | 'user';

export const auth = betterAuth({
  basePath: '/auth',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: allowedOrigins,
  account: {
    storeStateStrategy: 'database',
    skipStateCookieCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        react: createElement(ResetPassword, { url }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        react: createElement(VerifyEmail, { url }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        await sendEmail({
          to: user.email,
          subject: 'Approve email change',
          react: createElement(ChangeEmail, { newEmail, url }),
        });
      },
    },
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.create({
            data: { userId: user.id, displayName: user.name },
          });

          notifyUserSignup({ name: user.name, email: user.email });
        },
      },
    },
  },
  plugins: [bearer(), oneTimeToken()],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
});
