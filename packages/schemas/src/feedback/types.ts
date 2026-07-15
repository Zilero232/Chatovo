import type { z } from 'zod';
import type {
  feedbackPlatformSchema,
  reportProblemFormSchema,
  reportProblemSchema,
} from './inputs';

export type FeedbackPlatform = z.infer<typeof feedbackPlatformSchema>;
export type ReportProblemValues = z.infer<typeof reportProblemSchema>;
export type ReportProblemFormValues = z.infer<typeof reportProblemFormSchema>;
