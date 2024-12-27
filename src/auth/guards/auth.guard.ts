import { UserService } from '@/user/user.service'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(
				'Пользователь не авторизированю Пожайлуста, войдите в систему, что бы получить доступ.',
			)
		}

		const user = await this.userService.findById(request.session.userId)

		request.user = user
		return Boolean(request.user)
	}
}
