import { Injectable } from '@nestjs/common'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'
import { Message } from 'firebase-admin/lib/messaging/messaging-api'

@Injectable()
export class NotificationService {
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {}

  sendPushNotification(message: Message) {
    return this.firebase.messaging.send(message)
  }

  sendPushNotifications(messages: Message[]) {
    return this.firebase.messaging.sendAll(messages)
  }
}
