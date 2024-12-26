import { Request, Response } from 'express'

import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dtos'

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() body: RegisterDto) {
		return this.authService.register(req, body)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() body: LoginDto) {
		return this.authService.login(req, body)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
