import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Editor, Permissions } from './editor.entity'
import { CreateEditorDto } from './editor.dto'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class EditorService {
  constructor(
    @InjectRepository(Editor) private readonly editorRepository: Repository<Editor>,
    private readonly userService: UserService
  ) {}

  getByEventId(eventId: number, relations: ('user' | 'event')[] = []) {
    return this.editorRepository.find({ where: { id: eventId }, relations })
  }

  getById(id: number, relations: ('user' | 'event')[] = []) {
    return this.editorRepository.findOne({ where: { id }, relations })
  }

  async create({ permissions, userId, event }: CreateEditorDto, author: User) {
    const editor = await this.userService.getById(userId)

    if (!editor) {
      throw new BadRequestException('User not found')
    }

    if (!event) {
      throw new BadRequestException('Event not found')
    }

    const isOwner = event.creator.id === author.id
    const isEditor = event.editors.some(
      editor => editor.user.id === author.id && editor.permissions.includes(Permissions.EditAccess)
    )

    if (!isOwner || !isEditor) {
      throw new ForbiddenException('You do not have permission to edit the editors of this event')
    }

    return this.editorRepository.save(
      this.editorRepository.create({
        user: editor,
        event,
        permissions: permissions
      })
    )
  }
}
