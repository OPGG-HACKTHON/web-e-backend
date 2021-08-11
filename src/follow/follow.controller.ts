import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userRole } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/users/entities/user.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';

@ApiTags('팔로우 (Follow)')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({
    description: ':userId:가 :followingId 로 팔로잉을 진행한다.',
    summary: '팔로우 시작',
  })
  @ApiResponse({ status: 201, description: '팔로우 성공' })
  @ApiResponse({ status: 400, description: '입력데이터 오류' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @ApiResponse({ status: 405, description: '자신 팔로우' })
  @ApiResponse({ status: 406, description: '이미 팔로우한 사용자' })
  @ApiBody({
    type: CreateFollowDto,
    description: '사용자ID(userId), Follow할 ID (FollowingId)',
  })
  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/subscribe')
  async create(@Body() followData: CreateFollowDto) {
    try {
      const follow = await this.followService.createFollow(followData);
      return follow;
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          message: err.message,
        },
        err.status,
      );
    }
  }

  // userId의 팔로워들 구하기 (userId를 팔로우하는 사람들 가져오기)
  @ApiOperation({
    description: '특정 유저 팔로워 찾기',
    summary: '팔로워 찾기',
  })
  @ApiResponse({ status: 200, description: '팔로워 목록' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @Get(':userId//follower')
  async getMyFollowers(@Param('userId') userId: string) {
    try {
      const followers = await this.followService.getMyFollowers(userId);
      return {
        statusCode: 200,
        message: '팔로워 리스트',
        followers: followers,
        followersCount: followers.length,
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          message: err.message,
        },
        err.status,
      );
    }
  }
  // userId가 팔로잉하는 사용자들 구하기 (userId가 팔로우하는 사람들 가져오기)
  @ApiOperation({
    description: '특정 유저 팔로잉 목록 찾기',
    summary: '팔로잉 목록',
  })
  @ApiResponse({ status: 200, description: '팔로잉 목록' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @Get(':userId/following')
  async getMyFollowings(@Param('userId') userId: string) {
    try {
      const following = await this.followService.getMyFollowings(userId);
      return {
        StatusCode: 200,
        message: '팔로잉 유저 리스트',
        followings: following,
        followingsCounts: following.length,
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          message: err.message,
        },
        err.status,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({
    description: '언팔로우 진행하기',
    summary: '언팔로우',
  })
  @ApiResponse({ status: 200, description: '언팔로우' })
  @ApiResponse({ status: 404, description: '팔로우 목록 없음' })
  @Delete()
  async unfollow(@Body() followData: CreateFollowDto) {
    try {
      await this.followService.unfollow(followData);
      return { statusCode: 200, message: '언팔로우', data: followData };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          message: err.message,
        },
        err.status,
      );
    }
  }
}
