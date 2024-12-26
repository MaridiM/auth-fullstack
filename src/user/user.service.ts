import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateDto } from './dtos'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create({ email, password, displayName, picture, method, isVerified }: CreateDto) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified,
			},
			include: { accounts: true },
		})
		return user
	}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { accounts: true },
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден. Пожайлуста, проверьте введеные данные.')
		}
		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { accounts: true },
		})

		return user
	}
}
