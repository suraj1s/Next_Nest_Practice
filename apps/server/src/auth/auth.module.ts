import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from 'src/users/services/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';

// import { UserRepository } from 'src/users/repositories/user.repository'; // Import UserRepository

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UsersModule,
    TypeOrmModule.forFeature([User, Profile, Post]),
    JwtModule.register({
      secret: 'thisIsSecretKey123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersService, JWTStrategy], // Include UserRepository in the providers array
})
export class AuthModule {}
