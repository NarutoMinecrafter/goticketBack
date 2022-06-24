import { CreateUserDto } from './user.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(dto: CreateUserDto) {
    return await this.userRepository.create(dto)
  }

  async getAll() {
    return await this.userRepository.find()
  }

  async getBy(key: keyof User, value: User[keyof User]) {
    return await this.userRepository.findOneBy({ [key]: value })
  }
}
