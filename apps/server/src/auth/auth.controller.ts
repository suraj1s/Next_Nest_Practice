import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login/')
  login(@Req() req) {
    return this.authService.login(req.user);
  }
}
