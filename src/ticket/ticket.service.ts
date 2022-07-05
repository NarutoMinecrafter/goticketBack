import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './ticket.dto'
import { Ticket } from './ticket.entity'

@Injectable()
export class TicketService {
  constructor(@InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>) {}

  create(dto: CreateTicketDto) {
    return this.ticketRepository.save(this.ticketRepository.create(dto))
  }
}