import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login() {
    return 'login';
  }

  @Get('/login')
  // @UseGuards(AuthGuard('jwt'))
  profile() {
    return 'profile';
  }
}
