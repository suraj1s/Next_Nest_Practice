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

@ObjectType()
export class UserResponse {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  age: number;
}
