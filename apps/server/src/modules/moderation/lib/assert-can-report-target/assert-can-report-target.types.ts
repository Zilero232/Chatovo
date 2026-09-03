import type { AbuseTarget } from '@chatovo/schemas';

export type AssertCanReportTargetInput = {
  target: AbuseTarget;
  targetId: string;
  reporterId: string;
};
