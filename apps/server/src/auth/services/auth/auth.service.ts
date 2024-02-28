import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STATUS_CODES } from 'http';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(authPayload: AuthPayloadDto): Promise<any> {
    const { userName, password } = authPayload;
    const user = await this.userService.findUserOnlyByUsername(userName);

    if (user === undefined) {
      throw new UnauthorizedException(
        'Invalid credentials',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (user && user.password === password) {
      const userWithoutPassowrd = {
        userName: user.userName,
        id: user.id,
      };
      return this.jwtService.sign(userWithoutPassowrd);
    } else {
      throw new UnauthorizedException(
        'Invalid credentials',
        STATUS_CODES.UNAUTHORIZED,
      );
    }
  }
}
