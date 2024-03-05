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
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findUserById(id);
  }

  // @ResolveField((returns) => UserSetting, { nullable: true, name: 'settings' })
  // getUserSettings(@Parent() user: User): UserSetting | null {
  //   return this.getUserSettings(user.id);
  // }

  @Mutation((returns) => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this.userService.createUser(createUserData);
  }

  @Mutation((returns) => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserData') updateUserData: CreateUserInput,
  ) {
    return this.userService.updateUser(id, updateUserData);
  }
}
