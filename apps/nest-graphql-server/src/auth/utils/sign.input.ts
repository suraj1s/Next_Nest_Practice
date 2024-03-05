import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

}

@InputType()
export class SignUpUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  age: number;
}

