import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'user']);

const emailSchema = z.email('validation.emailInvalid').trim().toLowerCase();
const passwordSchema = z.string().min(8, 'validation.passwordMin');
const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'validation.nameMin')
  .max(32, 'validation.nameMax');

type WithConfirm = { password?: string; newPassword?: string; confirmPassword: string };

const passwordsMatch = (values: WithConfirm) => {
  const next = values.password ?? values.newPassword;

  return next === values.confirmPassword;
};

const mismatchIssue = {
  message: 'validation.passwordsMismatch',
  path: ['confirmPassword'] as string[],
};

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    name: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, mismatchIssue);

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, mismatchIssue);

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'validation.required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, mismatchIssue);

export const profileSchema = z.object({
  displayName: displayNameSchema,
  profileUrl: z.union([z.literal(''), z.url('validation.urlInvalid')]),
  bannerColor: z.string().nullable(),
  bio: z.string().max(280, 'validation.bioMax'),
});
