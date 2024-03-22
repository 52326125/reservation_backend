import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 100, nullable: true })
  description: string;
}
