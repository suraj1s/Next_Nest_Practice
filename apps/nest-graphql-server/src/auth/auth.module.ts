import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { JWT_AUTH_TOKEN_SECRET } from 'env.constants';
import { JWTAccessTokenStrategy } from './strategies/accessToken.strategy';
import { JWTRefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { User } from 'src/user/models/User';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/services/user.service';
import { AuthResolver } from './resolvers/auth.resolver';

// auth refrense : https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: JWT_AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JWTAccessTokenStrategy,
    JWTRefreshTokenStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
