import { verify } from 'argon2'
import { Request, Response } from 'express'

import { UserService } from '@/user/user.service'
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EAuthMethod, User } from '@prisma/__generated__'

import { LoginDto, RegisterDto } from './dtos'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	public async register(req: Request, body: RegisterDto) {
		const isExists = await this.userService.findByEmail(body.email)

		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожайлуста, используйте другой email или войдите в систему.',
			)
		}

		const newUser = await this.userService.create({
			email: body.email,
			password: body.password,
			displayName: body.name,
			picture: '',
			method: EAuthMethod.CREDENTIALS,
			isVerified: false,
		})

		return this.saveSession(req, newUser)
	}

	public async login(req: Request, body: LoginDto) {
		const user = await this.userService.findByEmail(body.email)
		if (!user || !user.password) {
			throw new NotFoundException('Пользователь не найден. Пожайлуста, проверте введенные данные.')
		}

		const isValidPassword = await verify(user.password, body.password)
		if (!isValidPassword) {
			throw new NotFoundException(
				'Не верный пароль. Пожайлуста, попробуйте еще раз или восстановите пароль, если забыли его.',
			)
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.',
						),
					)
				}
				res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.',
						),
					)
				}
				resolve({ user })
			})
		})
	}
}
