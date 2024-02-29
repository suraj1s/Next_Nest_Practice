import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STATUS_CODES } from 'http';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // UsersService is injected into the LocalStrategy class using the constructor which is imported in auth.module.ts in imports array
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'password',
    });
  }

  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request.body, 'form local strategy');
    return request;
  }

  async validate(userName: string, password: string): Promise<any> {
    console.log(userName, password, 'username and password');

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
