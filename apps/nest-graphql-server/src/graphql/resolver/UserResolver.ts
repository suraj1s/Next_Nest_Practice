import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../models/User';
import { UserSetting } from '../models/UserSetting';
import { CreateUserInput } from '../utils/createUserInput';

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
const userSettingsData = [
  {
    userId: 1,
    recievedNotification: true,
  },
  {
    userId: 2,
    recievedNotification: false,
  },
  {
    userId: 3,
    recievedNotification: true,
  },
];
const tmepId = 3;

@Resolver((of) => User)
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

  @ResolveField((returns) => UserSetting, { nullable: true, name: 'settings' })
  getUserSettings(@Parent() user: User): UserSetting | null {
    const userSetting = userSettingsData.find(
      (setting) => setting.userId === user.id,
    );

    if (!userSetting) {
      // Handle the case when user settings are not found
      // You can either return a default value or throw an error
      return null;
    }

    return userSetting;
  }

  @Mutation((returns) => User)
  createUser(
    // @Args('username') username: string,
    // @Args('password') password: string,
    @Args('createUserData') createUserData: CreateUserInput,
  ) {
    // const newUser = { username, password, id: id + 1 };
    const newUser = { ...createUserData, id: tmepId + 1 };
    return newUser;
  }
}
