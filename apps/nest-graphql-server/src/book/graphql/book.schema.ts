import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
