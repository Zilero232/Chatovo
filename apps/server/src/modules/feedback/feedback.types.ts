import type { ReportProblemValues } from '@chatovo/schemas';

export type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};
