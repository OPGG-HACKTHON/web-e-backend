import { HttpException, Injectable, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginData: LoginUserDto): Promise<any> {
    const user = await this.usersService.findOne(loginData.userId);
    if (!user) {
      throw new HttpException('유저 정보가 없습니다.', 401);
    }

    const isMatch = await bcrypt.compare(
      loginData.userPassword,
      user.userPassword,
    );
    if (isMatch) {
      const { userPassword, ...result } = user;
      return result;
    } else {
      throw new HttpException('비밀번호가 일치하지 않습니다.', 400);
    }
  }

  async login(user: any): Promise<any> {
    //update recent loginTime
    const loginAt = await this.usersService.updateLoginAt(user.userId);

    const payload = {
      userId: user.userId,
      userPhotoURL: user.userPhotoURL,
      userCoverURL: user.userCoverURL,
      userColor: user.userColor,
      userIntro: user.userIntro,
      userFeed: user.userFeed,
      lolTier: user.lolTier,
      pubgTier: user.pubgTier,
      watchTier: user.watchTier,
      userRole: user.userRole,
      recentLoginAt: loginAt,
    };
    return {
      statusCode: 201,
      message: '로그인 성공, 토큰 발행',
      access_token: this.jwtService.sign(payload),
      data: user,
    };
  }
}
