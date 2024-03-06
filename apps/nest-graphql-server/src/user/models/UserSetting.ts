import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'userSetting' })
@ObjectType()
export class UserSetting {
  @PrimaryGeneratedColumn()
  settingId: number;

  @Field((type) => Int)
  userId: number;

  @Field({ defaultValue: false, nullable: false })
  recievedNotification: boolean;
}
