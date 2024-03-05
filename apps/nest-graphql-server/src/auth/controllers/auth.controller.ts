import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { JWTRefreshTokenGaurd } from '../gaurds/refreshToken.garud';
import { JWTAccessTokenGaurd } from '../gaurds/accessToken.gaurd';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authPayload: AuthPayloadDto) {
    console.log(authPayload, 'authPayload form suth signup controller');
    const createdUser = await this.authService.signUp(authPayload);
    console.log(createdUser, 'createdUser');
    return {
      message: 'User created successfully',
      user: createdUser,
    };
  }
  @Post('signin')
  signin(@Body() data: any) {
    return this.authService.signIn(data);
  }

  @Get('profile')
  @UseGuards(JWTAccessTokenGaurd)
  profile(@Req() req: Request) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(JWTRefreshTokenGaurd)
  refreshTokens(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['userId']);
    return { message: 'User logged out successfully' };
  }
}
