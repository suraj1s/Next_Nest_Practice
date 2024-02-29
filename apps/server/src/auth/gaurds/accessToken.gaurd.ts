import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAccessTokenGaurd extends AuthGuard('jwt-access-token') {}
