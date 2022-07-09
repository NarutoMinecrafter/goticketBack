import { ChangeUserDto, CreateUserDto } from './user.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  create(dto: CreateUserDto) {
    return this.userRepository.save(this.userRepository.create(dto))
  }

  getAll() {
    return this.userRepository.find()
  }

  getBy(key: keyof User, value: User[keyof User]) {
    return this.userRepository.findOneBy({ [key]: value })
  }

  async changeUser({ id, ...dto }: ChangeUserDto, user: User) {
    if (id !== user.id) {
      throw new Error('You can change only your own profile')
    }

    const result = await this.userRepository.update(id, dto)

    return Boolean(result.affected)
  }

  async getById(id: number) {
    const user = await this.getBy('id', id)

    if (!user) {
      throw new Error('User not found')
    }

    user.events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }

  static getUserAge(date: Date): number {
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
