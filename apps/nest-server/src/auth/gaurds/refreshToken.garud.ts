import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTRefreshTokenGaurd extends AuthGuard('jwt-refresh-token') {}
