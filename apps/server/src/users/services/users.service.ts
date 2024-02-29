import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
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
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  findUsers() {
    return this.usersRepository.find({ relations: ['profile', 'post'] });
  }

  async findUserById(id: number) {
    // const user = await this.usersRepository.findOneBy({ id });
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'post'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  async findUserOnlyById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserOnlyByUsername(userName: string) {
    const user = await this.usersRepository.findOneBy({ userName });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
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
    const user = await this.findUserOnlyById(id);
    const newProfile = this.profilesRepository.create({
      ...createUserProfileData,
      createdAt: new Date(),
    });
    const savedProfile = await this.profilesRepository.save(newProfile);
    user.profile = savedProfile;
    return this.usersRepository.save(user);
  }

  async createUserPost(id: number, postData: any) {
    const user = await this.findUserOnlyById(id);
    const newPost = this.postsRepository.create({
      ...postData,
      createdAt: new Date(),
      user,
    });
    const savedPost = await this.postsRepository.save(newPost);
    return savedPost;
    // console.log(savedPost)
    // return this.postsRepository.save(savedPost);
  }

  async findUserPosts(id: number) {
    const user = await this.findUserOnlyById(id);
    return this.postsRepository.find({ where: { user } });
  }
}
