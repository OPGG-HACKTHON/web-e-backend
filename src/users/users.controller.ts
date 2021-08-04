import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userRole } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
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
  @ApiCreatedResponse({ description: '회원가입 완료' })
  @ApiResponse({ status: 400, description: '입력정보 오류' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() userData: CreateUserDto) {
    await this.userService.register(userData);
    return { statusCode: 201, message: '회원가입 완료' };
    //async await을 붙여줘야 service에서 내뿜은 에러를 받을 수 있다.
  }

  @Get(':userId')
  @ApiOperation({
    summary: '특정 유저 찾기',
    description: '특정 ID 유저의 정보를찾는다.',
  })
  @ApiOkResponse({ description: '유저 정보 반환', type: User })
  @ApiBadRequestResponse({ description: '입력값 오류' })
  @ApiResponse({ status: 401, description: '사용자 없음' })
  async findOne(@Param('userId') userId: string) {
    const data = await this.userService.findOne(userId);
    return { statusCode: 200, message: '데이터 반환 성공', data };
  }

  @ApiBearerAuth('access-token') //Bearer 토큰이 필요, 이름으로 대체
  @ApiOperation({
    summary: '유저 삭제',
    description: '아이디를 삭제한다.',
  })
  @ApiUnauthorizedResponse({ description: '사용자 권한오류' })
  @ApiBadRequestResponse({ description: '입력값 오류' })
  @ApiOkResponse({ description: '삭제 완료' })
  @Delete(':userId')
  @userRole(Role.USER) // USER Role을 가진 경우만 접근 가능
  @UseGuards(JwtAuthGuard, RoleGuard) // 두개의 Guard를 통과해야 api 접근
  async deleteUser(@Body() deleteData: LoginUserDto) {
    await this.userService.deleteUser(deleteData);
    return { statusCode: 200, message: '삭제 완료' };
  }

  @ApiBearerAuth('access-token') //Bearer 토큰이 필요, 이름으로 대체
  @ApiUnauthorizedResponse({ description: '사용자 권한오류' })
  @ApiBadRequestResponse({ description: '입력값 오류' })
  @ApiOkResponse({ description: '적용완료' })
  @Patch('/:userId')
  @userRole(Role.USER) // USER Role을 가진 경우만 접근 가능
  @UseGuards(JwtAuthGuard, RoleGuard) // 두개의 Guard를 통과해야 api 접근
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserDto,
  ) {
    await this.userService.updateUser(userId, updateData);
    return { statusCode: 200, message: '적용완료' };
  }

  @ApiBearerAuth('access-token') //Bearer 토큰이 필요, 이름으로 대체
  @ApiUnauthorizedResponse({ description: '사용자 권한이 없습니다.' })
  @Get('/check/user')
  @userRole(Role.USER) // ADMIN Role을 가진 경우만 접근 가능
  @UseGuards(JwtAuthGuard, RoleGuard)
  getUser() {
    return `I'm User`;
  }

  @ApiBearerAuth('access-token') //Bearer 토큰이 필요, 이름으로 대체
  @ApiUnauthorizedResponse({ description: '사용자 권한이 없습니다.' })
  @Get('/check/admin')
  @userRole(Role.ADMIN) // ADMIN Role을 가진 경우만 접근 가능
  @UseGuards(JwtAuthGuard, RoleGuard)
  getAdmin() {
    return `U R Admin`;
  }
}
