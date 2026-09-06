import { applyDecorators, UseGuards } from '@nestjs/common';

import { AdminOnlyGuard } from '../../guards/admin-only';

export const AdminOnly = () => applyDecorators(UseGuards(AdminOnlyGuard));
