import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './users/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '사용자 로그인',
    description: '로그인을 진행한다',
  })
  @ApiOkResponse({
    description: '유저 로그인',
  })
  @ApiUnauthorizedResponse({ description: '유효기간 만료' })
  @ApiResponse({ status: 400, description: '유저 ID 오류' })
  @Post('auth/login')
  @ApiBody({ type: LoginUserDto }) //id와 비밀번호를 받는 형식
  //Body로 전달해야 DTO데이터가 넘어간다!
  async login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  @ApiBearerAuth('access-token') //Bearer 토큰이 필요, 이름으로 대체
  @ApiOperation({
    summary: 'jwt payload 확인',
    description: 'jwt에 담긴 payload값을 확인한다',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
