import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_AUTH_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from 'env.constants';
import { STATUS_CODES } from 'http';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { UsersService } from 'src/users/services/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // this is without refresh token ussed in local strategy
  async validateUser(authPayload: AuthPayloadDto): Promise<any> {
    const { userName, password } = authPayload;
    const user = await this.usersService.findUserOnlyByUsername(userName);

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

  async signUp(createUserDto: any): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findUserOnlyByUsername(
      createUserDto.userName,
    );
    // console.log(userExists, 'userExists');
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    console.log(hash, 'hash');
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.userName);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: any) {
    // Check if user exists
    const user = await this.usersService.findUserOnlyByUsername(data.userName);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.userName);
    // signin gardha refresh token update garna ko lagi
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.updateUser(userId, { refreshToken: null });
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserOnlyById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.userName);
    // this is for circular refresh token update
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
    };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  async getTokens(userId: number, userName: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: userId,
          userName,
        },
        {
          secret: JWT_AUTH_TOKEN_SECRET,
          expiresIn: '30s',
        },
      ),
      this.jwtService.signAsync(
        {
          userId: userId,
          userName,
        },
        {
          secret: JWT_REFRESH_TOKEN_SECRET,
          expiresIn: '3m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
