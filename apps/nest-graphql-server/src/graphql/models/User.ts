import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './UserSetting';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  nickName: string;

  @Field({ nullable: true })
  settings?: UserSetting;
}
