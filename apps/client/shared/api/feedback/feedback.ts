import { api, readErrorMessage } from '../http';

import type { ReportProblemValues } from '@chatovo/schemas';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

export const reportProblem = async ({
  screenshot,
  ...values
}: ReportProblemArgs): Promise<void> => {
  const res = await api.feedback.$post({
    form: { ...values, ...(screenshot && { screenshot }) },
  });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to send report: ${res.status}`);
  }
};
