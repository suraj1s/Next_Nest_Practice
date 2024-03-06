import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  age: number;
}
@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  age: number;
}
