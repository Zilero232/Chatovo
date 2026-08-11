import {
  registerPushDeviceInputSchema,
  unregisterPushDeviceInputSchema
} from '@chatovo/schemas/push';
import { createZodDto } from 'nestjs-zod';

export class RegisterPushDeviceDto extends createZodDto(registerPushDeviceInputSchema) {}

export class UnregisterPushDeviceDto extends createZodDto(unregisterPushDeviceInputSchema) {}
