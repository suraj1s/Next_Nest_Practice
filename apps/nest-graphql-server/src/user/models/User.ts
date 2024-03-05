import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSetting } from './UserSetting';

@Entity({ name: 'users' })
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
  refreshToken: string;

  // @Field({ nullable: true })
  // @OneToOne(() => UserSetting)
  // @JoinColumn()
  // setting: UserSetting;

  // in case of many to many relationship reverse mapping is also
  // @OneToMany(() => Post, (post) => post.user)
  // @JoinColumn()
  // post: Post[];

  // @ManyToOne(() => User, (user) => user.post)
  // @JoinColumn()
  // user: User;
}
