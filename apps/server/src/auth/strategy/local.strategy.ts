import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STATUS_CODES } from 'http';
import { Strategy } from 'passport-local';
import { UserValidation } from 'src/utils/type';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // UsersService is injected into the LocalStrategy class using the constructor which is imported in auth.module.ts in imports array
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userName: string, password: string): Promise<UserValidation> {
    console.log(userName, password, 'username and password');

    const user = await this.authService.validateUser({ userName, password });
    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (user) {
      return user;
    }
  }
}
