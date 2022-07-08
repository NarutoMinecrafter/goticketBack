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

  getById(id: number) {
    return this.ticketRepository.createQueryBuilder('ticket').where('ticket.event.id = :id', { id }).getMany()
  }

  update(ticket: Partial<Ticket> & Record<'id', Ticket['id']>) {
    return this.ticketRepository.update(ticket.id, ticket)
  }

  async buy({ id, count, user, event, additionalInfo }: BuyTicketDto) {
    const ticket = await this.getBy('id', id)

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${id} is not defined!`)
    }

    const { isAgeRequired, minRequiredAge, isSexRequired, isIDCodeRequired, isInstagramRequired } =
      event.requiredAdditionalInfo
    const { name, phone, age, sex, IDcode, instagram } = additionalInfo

    if (!name) {
      throw new BadRequestException('Name not found')
    }

    if (!phone) {
      throw new BadRequestException('Phone not found')
    }

    if ((isAgeRequired || minRequiredAge) && !age) {
      throw new BadRequestException('Age not found')
    }

    if (isSexRequired && !sex) {
      throw new BadRequestException('Sex not found')
    }

    if (isIDCodeRequired && !IDcode) {
      throw new BadRequestException('ID-Code not found')
    }

    if (isInstagramRequired && !instagram) {
      throw new BadRequestException('Instagram not found')
    }

    if (minRequiredAge && age && age <= minRequiredAge) {
      throw new BadRequestException(`You must be at least ${minRequiredAge} years of age to purchase a ticket`)
    }

    ticket.currentCount -= count

    await this.update(ticket)

    return await this.guestService.create({ additionalInfo, user, event, ticket })
  }

  getByAuthor(id: number) {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.editors', 'editor')
      .where('ticket.creator.id = :id', { id })
      .orWhere('editor.id = :id', { id })
      .getMany()
  }
}
