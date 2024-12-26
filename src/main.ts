import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import Redis from 'ioredis'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ms, parseBoolean, StringValue } from './libs/common/utils'

/**
 * Запускает приложение NestJS.
 *
 * Функция инициализирует приложение, настраивает промежуточное ПО,
 * конфигурирует управление сессиями и запускает сервер.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} Промис, который разрешается, когда приложение запущено.
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const redis = new Redis(config.getOrThrow<string>('REDIS_URI'))

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.enableCors({
		origin: config.getOrThrow<string>('CLIENT_URL'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	)

	await app.listen(config.getOrThrow<number>('SERVER_PORT') ?? 3000)
}
bootstrap()
