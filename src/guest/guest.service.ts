import { Guest } from './guest.entity'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChangeGuestStatusDto, CreateGuestDto } from './guest.dto'
import { User } from '../user/user.entity'

@Injectable()
export class GuestService {
  constructor(@InjectRepository(Guest) private readonly guestRepository: Repository<Guest>) {}

  create(dto: CreateGuestDto) {
    return this.guestRepository.save(this.guestRepository.create(dto))
  }

  getBy<T extends keyof Guest>(key: T, value: Guest[T]) {
    return this.guestRepository.find({ where: { [key]: value }, relations: ['event', 'user', 'ticket'] })
  }

  getByEventId(eventId: number) {
    return this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.user', 'user')
      .leftJoinAndSelect('guest.ticket', 'ticket')
      .innerJoin('guest.event', 'event')
      .where('event.id = :id', { id: eventId })
      .getMany()
  }

  async changeGuestStatus(dto: ChangeGuestStatusDto, user: User) {
    const guest = await this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.event', 'event')
      .leftJoinAndSelect('event.creator', 'user')
      .leftJoinAndSelect('event.editors', 'editor')
      .andWhere('guest.id = :id', { id: dto.id })
      .getOne()

    if (!guest) {
      throw new BadRequestException('Guest not found')
    }

    if (guest.event.creator.id !== user.id && !guest.event.editors.some(editor => editor.id === user.id)) {
      throw new ForbiddenException('You are not the owner of this event')
    }

    const result = await this.guestRepository.update(dto.id, { status: dto.status })

    return Boolean(result.affected)
  }
}
