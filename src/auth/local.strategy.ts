import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'ID', //검사할 필드는 ID
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(ID: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(ID, password);
    if (!user) {
      throw new UnauthorizedException(); //인증되지 않은경우, error handling
    }
    return user;
  }
}
