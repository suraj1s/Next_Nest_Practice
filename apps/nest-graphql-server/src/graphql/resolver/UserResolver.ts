import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';
import { UserSetting } from '../models/UserSetting';

const userData = [
  {
    id: 1,
    name: 'John',
    email: 'jhon@gmail.com',
    password: 'password',
  },
  {
    id: 2,
    name: 'Doe',
    email: 'doe@gmail.com',
    password: 'password',
  },
  {
    id: 3,
    name: 'Smith',
    email: 'smith@gmail.com',
    password: 'password',
  },
];

@Resolver()
export class UserResolver {
  @Query((returns) => [User])
  getUsers() {
    return userData;
  }

  @Query((returns) => User, { nullable: true })
  // argument id of type Int is passed to the getUserById method and refered as id
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return userData.find((user) => user.id === id);
  }

  @ResolveField((returns) => UserSetting , { nullable: true, name: 'settings' })
  getUserSettings(@Parent() user: User) {
    return {
      // userSettingsData.find((userSetting) => userSetting.userId === user.id)
      userId: user.id,
      recievedNotification: true,
    };
  }
}
