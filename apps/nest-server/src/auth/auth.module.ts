import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';
import { JWT_AUTH_TOKEN_SECRET } from 'env.constants';
import { JWTAccessTokenStrategy } from './strategies/accessToken.strategy';
import { JWTRefreshTokenStrategy } from './strategies/refreshToken.strategy';

// auth refrense : https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UsersModule,
    TypeOrmModule.forFeature([User, Profile, Post]),
    JwtModule.register({
      secret: JWT_AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JWTStrategy,
    JWTAccessTokenStrategy,
    JWTRefreshTokenStrategy,
  ],
})
export class AuthModule {}
