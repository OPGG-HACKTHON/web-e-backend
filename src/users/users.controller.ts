import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('사용자(User)')
@ApiResponse({
  description: '회원가입 API',
})
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입을 진행한다.',
  })
  @ApiCreatedResponse({ description: '회원가입을 진행한다.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() userData: CreateUserDto, @Res() res: Response) {
    const user: User = await this.userService.register(userData);
    return { status: res.status, ...user };
  }
}
