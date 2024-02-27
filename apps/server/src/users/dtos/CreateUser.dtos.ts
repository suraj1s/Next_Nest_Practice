// Purpose: DTO data that we are recieving form request body
export class CreateUserDto {
  userName: string;
  password: string;
  confirmPassword: string;
}
