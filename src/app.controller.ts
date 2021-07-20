import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
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
  @ApiUnauthorizedResponse({ description: '유효기간' })
  @Post('auth/login')
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginData: LoginUserDto) {
    return this.authService.login(loginData);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //Bearer 토큰이 필요
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
