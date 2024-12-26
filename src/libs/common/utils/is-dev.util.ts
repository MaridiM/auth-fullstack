import * as dotenv from 'dotenv'

import { ConfigService } from '@nestjs/config'

dotenv.config()
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
export const isDev = (configService: ConfigService) => configService.getOrThrow<string>('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
