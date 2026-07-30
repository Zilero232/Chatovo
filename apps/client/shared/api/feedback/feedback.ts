import type { ReportProblemValues } from '@chatovo/schemas';

import { api } from '../http';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

export const reportProblem = async ({
  screenshot,
  ...values
}: ReportProblemArgs): Promise<void> => {
  const fd = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value != null) {
      fd.append(key, String(value));
    }
  }

  if (screenshot instanceof File) {
    fd.append('screenshot', screenshot);
  }

  await api.post('/feedback', fd);
};
