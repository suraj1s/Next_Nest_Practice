import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';
import { UsersService } from 'src/users/services/users/users.service';
import { Post } from 'src/typeorm/entities/Post';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: 'thisIsSecretKey123',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Profile, Post]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersService],
})
export class AuthModule {}

//     UsersModule,
