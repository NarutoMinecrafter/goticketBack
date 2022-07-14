import { ChangeUserDto } from './user.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { getFormattedAddress } from '../utils/geolocation.utils'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(dto: Omit<User, 'id'>) {
    const existedUser = await this.userRepository.findOneBy({ phone: dto.phone })

    if (existedUser) {
      throw new BadRequestException('User already exists')
    }

    return this.userRepository.save(this.userRepository.create(dto))
  }

  getAll() {
    return this.userRepository.find()
  }

  getBy(key: keyof User, value: User[keyof User]) {
    return this.userRepository.findOne({ where: { [key]: value }, relations: ['events', 'guests'] })
  }

  update(user: Partial<User> & Record<'id', User['id']>) {
    return this.userRepository.update(user.id, user)
  }

  async changeUser({ location, ...dto }: ChangeUserDto, user: User) {
    if (location) {
      const address = await getFormattedAddress(location)
      const result = await this.userRepository.update(user.id, {
        location,
        address,
        ...dto
      })

      return Boolean(result.affected)
    }

    const result = await this.userRepository.update(user.id, dto)

    return Boolean(result.affected)
  }

  async getById(id: number) {
    const user = await this.getBy('id', id)

    if (!user) {
      throw new Error('User not found')
    }

    user.events?.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    return user
  }

  static getUserAge(date?: Date): number {
    if (!date) {
      return 0
    }

    const now = new Date()
    const age = now.getFullYear() - date.getFullYear()

    if (now.getMonth() < date.getMonth()) {
      return age - 1
    }

    if (now.getMonth() === date.getMonth() && now.getDate() < date.getDate()) {
      return age - 1
    }

    return age
  }
}
