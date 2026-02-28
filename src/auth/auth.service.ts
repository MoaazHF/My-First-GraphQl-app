import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export interface AuthResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthResponse> {
    const user = await this.usersService.signIn(email, pass);
    return this.login({ id: user.id, email: user.email });
  }

  async login(user: { id: number; email: string }): Promise<AuthResponse> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
