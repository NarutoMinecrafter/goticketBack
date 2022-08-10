import { Injectable } from '@nestjs/common'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'

@Injectable()
export class SmsService {
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {}

  public sendCode() {}
}
