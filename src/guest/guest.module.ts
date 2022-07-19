import { Module } from '@nestjs/common'
import { GuestService } from './guest.service'
import { GuestController } from './guest.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Guest } from './guest.entity'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [TypeOrmModule.forFeature([Guest]), NotificationModule],
  providers: [GuestService],
  controllers: [GuestController],
  exports: [GuestService]
})
export class GuestModule {}
