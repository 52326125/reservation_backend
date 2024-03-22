import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 16,
  })
  username: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 32 })
  nickname: string;

  @Column({ type: 'bool', default: false })
  is_admin: boolean;

  @Column({ length: 32 })
  email: string;

  @Column({ type: 'bool', default: false })
  is_frozen: boolean;

  @Column({
    length: 50,
    nullable: true,
  })
  profile: string;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_role' })
  roles: Role[];
}
