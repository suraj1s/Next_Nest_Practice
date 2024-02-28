import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type User = {
  userId: number;
  username: string;
  password: string;
};
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  user: User[] = [
    { userId: 1, username: 'aminbista', password: 'aminpassword' },
    { userId: 2, username: 'jhondoe', password: 'jhonpassword' },
  ];

  getUser(username: string) {
    return this.user.find((user) => user.username === username);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.getUser(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
