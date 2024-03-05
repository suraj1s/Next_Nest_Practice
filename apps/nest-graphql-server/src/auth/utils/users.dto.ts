export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  age: number;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  age?: number;
  refreshToken?: string;
}

export class SignInUserDto {
  email: string;
  password: string;
}


