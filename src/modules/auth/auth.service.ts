import dotenv from 'dotenv'
import { UserService } from '../user/user.service'
import { HOTP } from '@otplib/core'
import { createDigest } from '@otplib/plugin-crypto'
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createClient, RedisClientType } from 'redis'
import { CodeDto, LoginDto, PhoneDto } from './auth.dto'
import { CreateUserDto } from '../user/user.dto'
import { Twilio } from 'twilio'

dotenv.config()

const { REDIS_URL, HOTP_SECRET, TWILLO_ACCOUNT_SID, TWILLO_AUTH_TOKEN, TWILLO_PHONE } = process.env

interface IPhone {
  code: number
  confirmed: boolean
}

@Injectable()
export class AuthService {
  private readonly hotp = new HOTP({ step: 300, createDigest, digits: 4 })
  private readonly redis: RedisClientType
  private readonly twillo: Twilio

  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {
    this.redis = createClient({ url: REDIS_URL })
    this.redis.connect()
    this.twillo = new Twilio(TWILLO_ACCOUNT_SID, TWILLO_AUTH_TOKEN)
  }

  async login(dto: LoginDto) {
    const isConfirmed = await this.checkCode(dto)

    if (isConfirmed) {
      const user = await this.userService.getBy('phone', dto.phone)

      if (user) {
        const token = await this.jwtService.signAsync({ id: user.id })

        if (dto.pushNotificationToken) {
          this.userService.update({ id: user.id, pushNotificationToken: dto.pushNotificationToken })
        }

        return { token }
      }

      return { authorized: false, confirmed: true }
    }

    throw new UnauthorizedException()
  }

  async register(dto: CreateUserDto) {
    const existedUser = await this.userService.getBy('phone', dto.phone)

    if (existedUser) {
      throw new BadRequestException('User already exists')
    }

    const candidatePromise = await this.redis.get(dto.phone)
    const candidate: IPhone | null = candidatePromise && JSON.parse(candidatePromise)
    const isConfirmed = candidate?.confirmed

    if (isConfirmed) {
      const user = await this.userService.create(dto)
      const token = await this.jwtService.signAsync({ id: user.id })

      return { token }
    }

    throw new ForbiddenException({ message: 'Code is not confirmed!' })
  }

  async sendCode({ phone }: PhoneDto) {
    const code = Number(this.hotp.generate(HOTP_SECRET, 4))

    await this.redis.set(phone, JSON.stringify({ code, confirmed: false }))

    await this.twillo.messages.create({
      body: `Your GoTicket verefication code: ${code}`,
      from: TWILLO_PHONE,
      to: phone
    })

    return { code }
  }

  private async checkCode({ phone, code }: CodeDto) {
    const candidatePromise = await this.redis.get(phone)
    const candidate: IPhone | null = candidatePromise && JSON.parse(candidatePromise)

    if (candidate?.code === code && this.hotp.check(code.toString(), HOTP_SECRET, 4)) {
      this.redis.set(phone, JSON.stringify({ code, confirmed: true }))

      return true
    }

    return false
  }
}
