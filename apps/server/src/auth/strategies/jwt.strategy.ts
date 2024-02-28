import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth/auth.service';

export class JWTStrategy extends PassportStrategy(Strategy) {
  // here by passing strategy we are telling that we are using jwt strategy
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // this is the way to extract token from request like from header or from query parameter or form the body of the request itself
      ignoreExpiration: false, // if we want to ignore the expiration of the token then we can set it to true
      secretOrKey: 'thisIsSecretKey123',
    });
  }

  async validate(payload: any) {
    console.log(payload, 'from jwt strategy');
    return payload;
  }
}
