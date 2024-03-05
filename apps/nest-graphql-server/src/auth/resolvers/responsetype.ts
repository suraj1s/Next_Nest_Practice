import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTokensResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class AccessTokenResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}