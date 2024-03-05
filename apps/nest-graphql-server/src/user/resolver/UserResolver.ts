import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';
import { CreateUserInput } from '../utils/createUserInput';
import { UserService } from '../services/user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [User])
  getUsers() {
    return this.userService.findUsers();
  }

  @Query((returns) => User, { nullable: true })
  // argument id of type Int is passed to the getUserById method and refered as id
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findUserById(id);
  }

  // @ResolveField((returns) => UserSetting, { nullable: true, name: 'settings' })
  // getUserSettings(@Parent() user: User): UserSetting | null {
  //   return this.getUserSettings(user.id);
  // }

  @Mutation((returns) => User)
  createUser(
    // @Args('username') username: string,
    // @Args('password') password: string,
    @Args('createUserData') createUserData: CreateUserInput,
  ) {
    return this.userService.createUser(createUserData);
  }
}
