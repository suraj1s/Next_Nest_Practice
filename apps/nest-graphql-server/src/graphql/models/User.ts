import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './UserSetting';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users'})
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

  @Column()
  @Field({ nullable: true })
  nickName: string;

  @Column()
  @Field({ nullable: true })
  settings?: UserSetting;
}
