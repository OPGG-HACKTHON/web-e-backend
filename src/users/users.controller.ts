import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('사용자 API')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  @ApiOperation({
    summary: '유저 회원가입 API',
    description: '회원가입을 진행한다',
  })
  @ApiCreatedResponse({
    description: '회원가입을 진행한다.',
  })
  async create() {
    return `user Register`;
  }
}
