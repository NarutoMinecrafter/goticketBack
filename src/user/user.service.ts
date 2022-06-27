import { CreateUserDto } from './user.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  create(dto: CreateUserDto) {
    // TODO: Remove User
    return this.userRepository.save(this.userRepository.create(dto))
  }

  getAll() {
    return this.userRepository.find()
  }

  getBy(key: keyof User, value: User[keyof User]) {
    return this.userRepository.findOneBy({ [key]: value })
  }
}
