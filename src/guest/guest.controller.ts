import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetGuestDto } from './guest.dto'
import { Guest } from './guest.entity'
import { GuestService } from './guest.service'

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @ApiOkResponse({ type: Guest, description: 'Guest with specified id' })
  @ApiResponse({ type: Guest, isArray: true, description: 'All guests if id is not specified' })
  @Get()
  get(@Query() { id }: GetGuestDto) {
    if (id) {
      return this.guestService.getBy('id', Number(id))
    }

    return this.guestService.getAll()
  }
}
