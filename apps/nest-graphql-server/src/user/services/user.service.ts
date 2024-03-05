import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { UpdateUserParams } from '../utils/type';
import { CreateUserInput } from '../utils/createUserInput';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public readonly usersRepository: Repository<User>,
  ) {}

  findUsers() {
    return this.usersRepository.find();
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserByEmail(email: string) {
    if (!email) {
      throw new HttpException('NO UserName provided ', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOneBy({ email: email });
    console.log(user, 'user from findUserOnlyByUsername');
    return user;
  }

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.usersRepository.update(id, userDetails);
  }

  createUser(userDetails: CreateUserInput) {
    // here we are creating a new user with all the data of type CreateUserParams and adding a createdAt field
    const newUser = this.usersRepository.create({
      // this is not a promise (sync operation)
      ...userDetails,
    });
    return this.usersRepository.save(newUser); //this is a promise (async operation)
  }

  deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
