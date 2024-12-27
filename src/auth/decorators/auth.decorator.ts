import { applyDecorators, UseGuards } from '@nestjs/common'
import { EUserRole } from '@prisma/__generated__'

import { AuthGuard, RolesGuard } from '../guards'

import { Roles } from './roles.decorator'

export function Authorization(...roles: EUserRole[]) {
	if (!!roles.length) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
	}

    return applyDecorators(UseGuards(AuthGuard))
}
