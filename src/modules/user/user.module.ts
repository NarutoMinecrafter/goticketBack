import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from './user.entity'
import { PaymentModule } from './../payment/payment.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), PaymentModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
