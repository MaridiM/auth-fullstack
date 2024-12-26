import { EAuthMethod } from "@prisma/__generated__"

export class CreateDto {
    email: string
    password: string
    displayName: string
    picture: string
    method: EAuthMethod
    isVerified: boolean
}
