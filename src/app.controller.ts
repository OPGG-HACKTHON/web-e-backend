import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './users/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    description: '유저 로그인',
  })
  @ApiUnauthorizedResponse({ description: '유효기간 만료' })
  @Post('auth/login')
  @ApiBody({ type: LoginUserDto }) //id와 비밀번호를 받는 형식
  //Body로 전달해야 DTO데이터가 넘어간다!
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth() //Bearer 토큰이 필요
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
