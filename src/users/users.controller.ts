import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('사용자(User)')
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
  async register(@Body() userData: CreateUserDto) {
    await this.userService.register(userData);
    return { statusCode: 200 };
    //async await을 붙여줘야 service에서 내뿜은 에러를 받을 수 있다.
  }

  @Get(':userId')
  @ApiOperation({
    summary: '특정 유저 찾기',
    description: '특정 ID 유저의 정보를찾는다.',
  })
  @ApiResponse({ description: '유저 정보를 반환한다.' })
  async findOne(@Param('userId') userId: string) {
    const data = await this.userService.findOne(userId);
    return { statusCode: 200, data };
  }
}
