import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field(() => Int)
  price: number;

  @Field({ nullable: true })
  status: string;
}

@InputType()
export class UpdateBookInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  price: number;
}
