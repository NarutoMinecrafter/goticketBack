import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEventDto, SortTypes, StringLocation } from './event.dto'
import { Event } from './event.entity'

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  create(dto: CreateEventDto) {
    return this.eventRepository.save(this.eventRepository.create(dto))
  }

  async getAll(sortBy?: SortTypes, userLocation?: StringLocation): Promise<Event[]> {
    const events = await this.eventRepository.find()

    if (!sortBy || (sortBy === SortTypes.ByGeolocation && !userLocation)) {
      return events
    }

    events.sort((prev, next) => {
      switch (sortBy) {
        case SortTypes.ByDate: {
          console.log(prev)
          return new Date(prev.startDate).getTime() - new Date(next.startDate).getTime()
        }
        case SortTypes.ByTicketsCount: {
          return prev.tickets?.length || 0 - next.tickets?.length || 0
        }
        case SortTypes.ByGeolocation: {
          // TODO: implement geolocation sorting
          return 0
        }
      }

      return 0
    })

    return events
  }

  getBy(key: keyof Event, value: Event[keyof Event]) {
    return this.eventRepository.findOneBy({ [key]: value })
  }
}
