import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUser.dtos';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  findUsers() {
    return this.usersRepository.find();
  }

  findUserById(id: number | any) {
    return this.usersRepository.findOne({ where: { id } });
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

  deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }

  async createUserProfile(
    id: number,
    createUserProfileData: CreateUserProfileDto,
  ) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const newProfile = this.profilesRepository.create({
      // this is not a promise (sync operation)
      ...createUserProfileData,
      createdAt: new Date(),
    });
    const savedProfile = await this.usersRepository.save(newProfile); //this is a promise (async operation)
    user.profile = savedProfile;
    return this.usersRepository.save(user);
  }
}
