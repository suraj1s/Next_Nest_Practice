import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_AUTH_TOKEN_SECRET } from 'env.constants';

type JwtPayload = {
  userId: string;
  username: string;
};

export class JWTAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // this is the way to extract token from request like from header or from query parameter or form the body of the request itself
      ignoreExpiration: false, // if we want to ignore the expiration of the token then we can set it to true
      secretOrKey: JWT_AUTH_TOKEN_SECRET, // this is the secret key that we are using to sign the token
    });
  }

  async validate(payload: JwtPayload) {
    console.log(payload, 'from jwt strategy');
    return payload;
  }
}
