import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { JWTAuthGaurd } from 'src/auth/gaurds/jwt.gaurd';
import { LocalGaurd } from 'src/auth/gaurds/local.gaurd';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGaurd)
  login(@Body() authPayload: AuthPayloadDto, @Req() req: Request) {
    console.log(authPayload, 'authPayload');
    // exceptions should be handled in coltroller
    // const user = this.authService.validateUser(authPayload);
    // if(!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return {
      message: 'User logged in successfully',
      auth_token: req.user,
    };
  }

  @Get('status')
  @UseGuards(JWTAuthGaurd)
  status(@Req() req: Request) {
    console.log('inside auth controller status ');
    return { user: req.user };
  }
}
