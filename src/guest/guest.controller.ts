import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger'
import { ChangeGuestStatusDto, GetGuestDto } from './guest.dto'
import { Guest } from './guest.entity'
import { GuestService } from './guest.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../user/user.entity'

@ApiTags('Guest')
@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @ApiOkResponse({ type: Guest, description: 'Guest with specified id' })
  @ApiResponse({
    type: OmitType(Guest, ['event']),
    isArray: true,
    description: 'All guests from event if eventId is specified'
  })
  @Get()
  get(@Query() { id, eventId }: GetGuestDto) {
    if (id) {
      return this.guestService.getBy('id', Number(id))
    }

    return this.guestService.getByEventId(Number(eventId))
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Boolean, description: 'Accept guest' })
  @Put('status')
  getBy(@Body() dto: ChangeGuestStatusDto, @Req() { user }: Record<'user', User>) {
    return this.guestService.changeGuestStatus(dto, user)
  }
}
