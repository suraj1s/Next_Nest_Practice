import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JWTAccessTokenGaurd } from 'src/auth/gaurds/accessToken.gaurd';
import { JWTRefreshTokenGaurd } from 'src/auth/gaurds/refreshToken.garud';
import { CurrentUser } from '../utils/getCurrentUser';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signup')
  async signup(@Args('authPayload') authPayload: AuthPayloadDto) {
    console.log(authPayload, 'authPayload from auth signup resolver');
    const createdUser = await this.authService.signUp(authPayload);
    console.log(createdUser, 'createdUser');
    return {
      message: 'User created successfully',
      user: createdUser,
    };
  }

  @Mutation('signin')
  signin(@Args('data') data: any) {
    return this.authService.signIn(data);
  }

  @Query('profile')
  @UseGuards(JWTAccessTokenGaurd)
  profile(@CurrentUser() user: any) {
    return user;
  }

  @Query('refreshTokens')
  @UseGuards(JWTRefreshTokenGaurd)
  refreshTokens(@CurrentUser() user: any) {
    const userId = user.userId;
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Mutation('logout')
  @UseGuards(JWTAccessTokenGaurd)
  logout(@CurrentUser() user: any) {
    this.authService.logout(user.userId);
    return { message: 'User logged out successfully' };
  }
}
