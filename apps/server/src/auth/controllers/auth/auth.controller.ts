import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  // @UseGuards(AuthGuard('local'))
  login(@Body() authPayload: AuthPayloadDto) {
    // exceptions should be handled in coltroller
    // const user = this.authService.validateUser(authPayload);
    // if(!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return this.authService.validateUser(authPayload);
  }

  @Get('/login')
  // @UseGuards(AuthGuard('jwt'))
  profile() {
    return 'profile';
  }
}
