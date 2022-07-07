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

  update(ticket: Partial<Ticket> & Record<'id', Ticket['id']>) {
    return this.ticketRepository.update(ticket.id, ticket)
  }

  async buy({ id, count, user, event, additionalInfo }: BuyTicketDto) {
    const ticket = await this.getBy('id', id)

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${id} is not defined!`)
    }

    // TODO: remake
    const { isAgeRequired, minRequiredAge, isSexRequired, isIDCodeRequired, isInstagramRequired } =
      ticket.requiredAdditionalInfo
    const { name, phone, age, sex, IDcode, instagram } = additionalInfo

    if (
      !name ||
      !phone ||
      ((isAgeRequired || minRequiredAge) && !age) ||
      (isSexRequired && !sex) ||
      (isIDCodeRequired && !IDcode) ||
      (isInstagramRequired && !instagram)
    ) {
      throw new BadRequestException('Some field is dont exist')
    }

    if (minRequiredAge && age && age <= minRequiredAge) {
      throw new BadRequestException(`You must be at least ${minRequiredAge} years of age to purchase a ticket`)
    }

    ticket.currentCount -= count

    await this.update(ticket)

    return await this.guestService.create({ additionalInfo, user, event, ticket })
  }
}
