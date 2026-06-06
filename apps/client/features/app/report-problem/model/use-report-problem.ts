import { useMutation } from '@tanstack/react-query';
import { isTauri } from '@tauri-apps/api/core';
import { reportProblem } from '@/shared/api';
import { env } from '@/shared/config';
import type { ReportProblemValues } from '@chatovo/schemas';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

const collectContext = () => ({
  appVersion: env.NEXT_PUBLIC_APP_VERSION,
  platform: isTauri() ? ('tauri' as const) : ('web' as const),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
});

export const useReportProblem = () => {
  return useMutation({
    mutationFn: ({ description, screenshot }: ReportProblemArgs) =>
      reportProblem({ description, screenshot, ...collectContext() }),
  });
};
