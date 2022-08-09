import { Module } from '@nestjs/common'
import { SmsService } from './sms.service'
import { FirebaseModule } from 'nestjs-firebase'
import { join } from 'path'

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: join(__dirname, '..', '..', '..', 'config', 'firebase_auth.json')
    })
  ],
  providers: [SmsService],
  exports: [SmsService]
})
export class SmsModule {}
