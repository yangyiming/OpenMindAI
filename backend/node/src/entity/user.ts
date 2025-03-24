import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

// 用户
@Entity()
export class User  {
    @ObjectIdColumn()
    id: ObjectID; // 主键列

    @Column()
    userName: string
    
    @Column()
    password: string
    
    @Column({ nullable: true })
    email?: string
}
