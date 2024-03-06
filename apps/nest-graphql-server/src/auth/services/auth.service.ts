import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_AUTH_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from 'env.constants';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/services/user.service';
import { CreateUserDto, SignInUserDto } from '../utils/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findUserByEmail(
      createUserDto.email,
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
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: SignInUserDto) {
    // Check if user exists
    const user = await this.usersService.findUserByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    // signin gardha refresh token update garna ko lagi
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.updateUser(userId, { refreshToken: null });
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    // this is for circular refresh token update
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      // we should send new refresh token for circular refresh token update
      // refreshToken: tokens.refreshToken,
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

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: userId,
          email,
        },
        {
          secret: JWT_AUTH_TOKEN_SECRET,
          expiresIn: '1m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId: userId,
          email,
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

  async getUserByEmail(email: string) {
    return this.usersService.findUserByEmail(email);
  }
}
