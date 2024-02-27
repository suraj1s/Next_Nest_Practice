import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findUsers() {
    return this.usersRepository.find();
  }

  findUserById(id: any) {
    return this.usersRepository.findOneBy(id);
  }

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.usersRepository.update(id, userDetails);
  }

  createUser(userDetails: CreateUserParams) {
    // here we are creating a new user with all the data of type CreateUserParams and adding a createdAt field
    const newUser = this.usersRepository.create({
      // this is not a promise (sync operation)
      ...userDetails,
      createdAt: new Date(),
    });
    return this.usersRepository.save(newUser); //this is a promise (async operation)
  }
}
