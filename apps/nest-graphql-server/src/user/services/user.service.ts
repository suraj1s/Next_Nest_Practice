import { Injectable } from '@nestjs/common';
import { UserModule } from '../user.module';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../utils/createUserInput';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public readonly userModel: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async create(user: CreateUserInput): Promise<User> {
    return this.userModel.save(user);
  }

  async update(id: number, user: User): Promise<User> {
    await this.userModel.update(id, user);
    return this.userModel.findOne({ where: { id } });
  }

  async remove(id: number): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });
    await this.userModel.delete(id);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async finsUserSettingById(id: number) {
    return this.userModel.findOne({ where: { id }, relations: ['setting'] });
  }
}
