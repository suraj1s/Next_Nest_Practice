import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// this is for code first approach
@Entity({ name: 'book' })
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field((type) => Int)
  price: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  status: string;

  @ManyToOne(() => User, (user) => user.book)
  @JoinColumn()
  user: User;
}
