import { Authorization, Authorized } from '@/auth/decorators'
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'

import { UserService } from './user.service'
import { EUserRole } from '@prisma/__generated__'

@Controller('users')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Authorization()
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	public async findPofile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@Authorization(EUserRole.ADMIN)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}
}
