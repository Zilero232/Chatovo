import type { z } from 'zod';
import type { reportProblemFormSchema, reportProblemSchema } from './inputs';

export type ReportProblemValues = z.infer<typeof reportProblemSchema>;
export type ReportProblemFormValues = z.infer<typeof reportProblemFormSchema>;
