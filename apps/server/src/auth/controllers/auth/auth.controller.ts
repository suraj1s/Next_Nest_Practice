import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
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
}
