import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userId', //검사할 필드는 ID
      passwordField: 'userPassword',
      passReqToCallback: false,
    });
  }

  async validate(userId: string, userPassword: string): Promise<any> {
    const loginData: LoginUserDto = {
      userId: userId,
      userPassword: userPassword,
    };
    const user = await this.authService.validateUser(loginData);
    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['로그인 정보가 없습니다.'],
        error: 'Forbidden',
      }); //인증되지 않은경우, error handling
    }
    return user;
  }
}
