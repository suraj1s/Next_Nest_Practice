import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSetting {
  @Field((type) => Int)
  userId: number;

  @Field({ defaultValue: false, nullable: false })
  recievedNotification: boolean;
}
