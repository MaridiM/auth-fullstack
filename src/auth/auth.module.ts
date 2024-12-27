import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '@/user/user.service'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getRecaptchaConfig } from '@/config/recaptcha.config'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService],
	imports: [GoogleRecaptchaModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: getRecaptchaConfig,
		inject: [ConfigService]
	})]
})
export class AuthModule {}
