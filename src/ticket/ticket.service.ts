import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GuestService } from '../guest/guest.service'
import { BuyTicketDto, CreateTicketDto } from './ticket.dto'
import { Ticket } from './ticket.entity'

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly guestService: GuestService
  ) {}

  create(dto: CreateTicketDto) {
    return this.ticketRepository.save(this.ticketRepository.create(dto))
  }

  getAll() {
    return this.ticketRepository.find()
  }

  getBy(key: keyof Ticket, value: Ticket[keyof Ticket]) {
    return this.ticketRepository.findOneBy({ [key]: value })
  }

  async buy({ id, count, user, event, additionalInfo }: BuyTicketDto) {
    const ticket = await this.getBy('id', id)

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${id} is not defined!`)
    }

    ticket.count -= count

    await this.guestService.create({ additionalInfo, user, event, ticket })
  }
}
