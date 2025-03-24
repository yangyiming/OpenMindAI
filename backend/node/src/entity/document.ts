import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';

@Entity()
export class Document {
  @ObjectIdColumn() 
  id: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  type: string;

  @Column('bigint')
  size: number;

  @Column()
  path: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
