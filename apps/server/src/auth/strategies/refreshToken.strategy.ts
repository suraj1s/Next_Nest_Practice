import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_TOKEN_SECRET } from 'env.constants';
import { Request } from 'express';

export class JWTRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // this is the way to extract token from request like from header or from query parameter or form the body of the request itself
      ignoreExpiration: false, // if we want to ignore the expiration of the token then we can set it to true
      secretOrKey: JWT_REFRESH_TOKEN_SECRET, // this is the secret key that we are using to sign the token
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim(); // get the refresh token from the request header and remove the Bearer keyword from it then trim it to remove any extra spaces
    return { ...payload, refreshToken };
  }
}
