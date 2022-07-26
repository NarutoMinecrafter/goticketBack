import { Module } from '@nestjs/common'
import { FirebaseModule } from 'nestjs-firebase'
import { join } from 'path'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: join(__dirname, '..', '..', '..', 'config', 'firebase.json')
    })
  ],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
