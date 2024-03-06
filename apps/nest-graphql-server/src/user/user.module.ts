import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/User';
import { UserResolver } from './resolver/UserResolver';
import { UserSetting } from './models/UserSetting';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  controllers: [],
  providers: [UserService, UserResolver],
})
export class UserModule {}
