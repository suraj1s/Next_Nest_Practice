import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from 'src/auth/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JWTAccessTokenGaurd } from 'src/auth/gaurds/accessToken.gaurd';
import { JWTRefreshTokenGaurd } from 'src/auth/gaurds/refreshToken.garud';
import { CurrentUser } from '../utils/getCurrentUser';
import { SignInUserInput, SignUpUserInput } from '../utils/sign.input';
import { User } from 'src/user/models/User';
import { AccessTokenResponse, AuthTokensResponse, LogoutResponse } from './responsetype';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => AuthTokensResponse)
  async signup(@Args('authPayload') authPayload: SignUpUserInput) {
    console.log(authPayload, 'authPayload from auth signup resolver');
    const createdUser = await this.authService.signUp(authPayload);
    console.log(createdUser, 'createdUser');
    return {
      message: 'User created successfully',
      user: createdUser,
    };
  }

  @Mutation((returns) => AuthTokensResponse)
  signin(@Args('data') data: SignInUserInput) {
    return this.authService.signIn(data);
  }

  // @Query('profile')
  // @UseGuards(JWTAccessTokenGaurd)
  // profile(@CurrentUser() user: any) {
  //   return user;
  // }

  @Mutation((returns) => AccessTokenResponse)
  @UseGuards(JWTRefreshTokenGaurd)
  refreshTokens(@CurrentUser() user: any) {
    const userId = user.userId;
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Mutation((returns) => LogoutResponse)
  @UseGuards(JWTAccessTokenGaurd)
  logout(@CurrentUser() user: any) {
    this.authService.logout(user.userId);
    return { message: 'User logged out successfully' };
  }
}
