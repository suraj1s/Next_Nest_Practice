import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from 'src/auth/authDto/auth.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/strategies/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // @UseGuards(LocalAuthGuard)
  @UseGuards(AuthGuard('local'))
  login(@Body() authPayload: AuthPayloadDto) {
    console.log(authPayload, 'authPayload');
    // exceptions should be handled in coltroller
    // const user = this.authService.validateUser(authPayload);
    // if(!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return this.authService.validateUser(authPayload);
  }
}
