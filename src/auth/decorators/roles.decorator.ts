import { SetMetadata } from '@nestjs/common'
import { EUserRole } from '@prisma/__generated__'

export const ROLES_KEY = 'roles'

export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles)
