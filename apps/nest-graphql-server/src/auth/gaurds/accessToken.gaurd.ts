import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
@Injectable()
export class JWTAccessTokenGaurd extends AuthGuard('jwt-access-token') {
  getRequest(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // Extract the authorization token from the headers
    const authToken = request.headers.authorization;
    console.log('Authorization Token:', authToken);

    return request;
  }
}

// @Injectable()
// export class JWTAccessTokenGaurd implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const ctx = GqlExecutionContext.create(context);
//     const request = ctx.getContext().req;
//     // Extract the authorization token from the headers
//     const authToken = request.headers.authorization;
//     if (authToken) {
//       const token = authToken.split(' ')[1];
//       try {
//         const decoded = jwt.verify(token, JWT_AUTH_TOKEN_SECRET);
//         console.log(decoded, 'decoded from jwt strategy 1111');
//         ctx.getContext().user = decoded;
//         return true;
//       } catch (error) {
//         throw new HttpException('Invalid token', 401);
//       }
//     }
//     console.log('Authorization Token:', authToken);
//   }
// }
