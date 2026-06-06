import { z } from 'zod';

const descriptionSchema = z
  .string()
  .trim()
  .min(10, 'validation.feedbackMin')
  .max(2000, 'validation.feedbackMax');

export const reportProblemSchema = z.object({
  description: descriptionSchema,
  appVersion: z.string().optional(),
  userAgent: z.string().optional(),
  platform: z.enum(['web', 'tauri']).optional(),
});

export const reportProblemFormSchema = reportProblemSchema.extend({
  screenshot: z.instanceof(File).optional(),
});
