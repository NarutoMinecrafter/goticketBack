import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SexEnum } from './user.dto'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  surname!: string

  @Column({ unique: true, nullable: false })
  phone!: string

  @Column({ unique: true })
  email: string

  @Column('date', { nullable: true })
  bithdate: Date

  @Column({ unique: true })
  IDcode: string

  @Column({ unique: true, nullable: true })
  instagram?: string

  @Column({ enum: SexEnum })
  sex?: SexEnum

  @Column({ nullable: true })
  avatar?: string
}
