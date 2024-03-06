import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSetting } from './UserSetting';
import { Book } from 'src/book/graphql/book.schema';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  refreshToken: string;

  @Field({ nullable: true })
  @OneToOne(() => UserSetting)
  @JoinColumn()
  userSetting: UserSetting;

  // in case of many to many relationship reverse mapping is also
  @OneToMany(() => Book, (book) => book.user)
  @JoinColumn()
  book: Book[];
}
