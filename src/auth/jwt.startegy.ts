import dotenv from 'dotenv'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'

dotenv.config()

const { JWT_SECRET } = process.env

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET
    })
  }

  async validate({ id }: Record<'id', User['id']>) {
    const user = await this.userService.getBy('id', id)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
