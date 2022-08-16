import { Module } from '@nestjs/common'
import { EditorService } from './editor.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Editor } from './editor.entity'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Editor]), UserModule],
  providers: [EditorService],
  exports: [EditorService]
})
export class EditorModule {}
