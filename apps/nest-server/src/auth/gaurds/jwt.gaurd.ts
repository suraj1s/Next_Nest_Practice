import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGaurd extends AuthGuard('jwt') {
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   console.log('insied jwt gaurd');
  //   return super.canActivate(context);
  // }
}
