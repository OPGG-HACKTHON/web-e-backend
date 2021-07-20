import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(loginData: LoginUserDto): Promise<User> {
    const user = await this.authService.validateUser(
      loginData.ID,
      loginData.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
