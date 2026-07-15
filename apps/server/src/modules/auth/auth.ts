import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';
import { createElement } from 'react';

import { allowedOrigins } from '../../config/cors';
import { validateEnv } from '../../config/env.schema';
import { basePrisma } from '../../core/base-prisma';
import { issueUniqueFriendTag } from '../../lib';
import { ChangeEmail, ResetPassword, sendEmail, VerifyEmail } from '../email';
import { notifyUserSignup } from '../telegram';
import { authBaseURL } from './auth-base-url';

const env = validateEnv(process.env);

export const auth = betterAuth({
  basePath: '/auth',
  baseURL: authBaseURL(),
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: allowedOrigins,
  account: {
    storeStateStrategy: 'database',
    skipStateCookieCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        react: createElement(VerifyEmail, { url }),
      });
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
      friendTag: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const friendTag = await issueUniqueFriendTag(user.name);

          return {
            data: {
              ...user,
              friendTag,
            },
          };
        },
        after: async (user) => {
          await basePrisma.profile.create({
            data: { userId: user.id, displayName: user.name },
          });

          notifyUserSignup({ name: user.name, email: user.email });
        },
      },
    },
  },
  plugins: [bearer()],
  database: prismaAdapter(basePrisma, { provider: 'postgresql' }),
});
