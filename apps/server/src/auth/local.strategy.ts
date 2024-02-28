// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(userName: string, password: string): Promise<any> {
//     console.log(userName, password, 'local strategy');
//     const user = await this.authService.validateUser(userName, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STATUS_CODES } from 'http';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // UsersService is injected into the LocalStrategy class using the constructor which is imported in auth.module.ts in imports array
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userName: string, password: string): Promise<any> {
    console.log(
      userName,
      password,
      'username and password from local strategy',
    );

    const user = await this.authService.validateUser({ userName, password });
    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials form local',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (user) {
      return user;
    }
  }
}
