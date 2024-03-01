import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from '../User';

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
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return userData.find((user) => user.id === id);
  }
}
