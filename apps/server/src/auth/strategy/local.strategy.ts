import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STATUS_CODES } from 'http';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/services/users/users.service';
import { UserValidation } from 'src/utils/type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // UsersService is injected into the LocalStrategy class using the constructor which is imported in auth.module.ts in imports array
  constructor(private readonly userService: UsersService) {
    super();
  }

  async validate(userName: string, password: string): Promise<UserValidation> {
    console.log(userName, password, 'username and password');

    const user = await this.userService.findUserOnlyByUsername(userName);
    const userToBeReturned: UserValidation = {
      userName: user.userName,
      password: user.password,
      id: user.id,
    };
    if (user === undefined) {
      throw new UnauthorizedException(
        'Invalid credentials',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (user && user.password === password) {
      return userToBeReturned;
    } else {
      throw new UnauthorizedException(
        'Invalid credentials',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
  }
}
