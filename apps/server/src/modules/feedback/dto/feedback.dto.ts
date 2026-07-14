import { reportProblemSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const reportProblemResultSchema = z.object({ ok: z.boolean() });

export class ReportProblemDto extends createZodDto(reportProblemSchema) {}

export class ReportProblemResultDto extends createZodDto(reportProblemResultSchema) {}
