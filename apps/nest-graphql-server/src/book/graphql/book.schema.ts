import { Field, Int, ObjectType } from '@nestjs/graphql';

// this is for code first approach
@ObjectType()
export class Book {
  @Field((type) => Int)
  id: number;

  @Field()
  title: string;

  @Field((type) => Int)
  price: number;
}
