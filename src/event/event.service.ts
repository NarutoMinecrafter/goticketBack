import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEventDto } from './event.dto'
import { Event } from './event.entity'

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  create(dto: CreateEventDto) {
    return this.eventRepository.save(this.eventRepository.create(dto))
  }
}
