import { Guest } from './guest.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateGuestDto } from './guest.dto'

@Injectable()
export class GuestService {
  constructor(@InjectRepository(Guest) private readonly guestRepository: Repository<Guest>) {}

  create(dto: CreateGuestDto) {
    return this.guestRepository.save(this.guestRepository.create(dto))
  }

  getAll() {
    return this.guestRepository.find()
  }

  getBy(key: keyof Guest, value: Guest[keyof Guest]) {
    return this.guestRepository.findOneBy({ [key]: value })
  }
}
