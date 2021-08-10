import {
  Body,
  Controller,
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

  @ApiOperation({ description: '팔로우 신청' })
  @ApiResponse({ status: 201, description: '팔로우 성공' })
  @ApiResponse({ status: 400, description: '입력데이터 오류' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @ApiResponse({ status: 405, description: '자신 팔로우' })
  @ApiResponse({ status: 406, description: '이미 팔로우한 사용자' })
  @ApiBody({ type: CreateFollowDto, description: '팔로우를 시작한다' })
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
  @Get('/follower/:userId')
  async getMyFollowers(@Param('userId') userId: string) {
    try {
      const follower = await this.followService.getMyFollowers(userId);
      return {
        StatusCode: 200,
        Follower: follower[0],
        FollowerCount: follower[1],
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
  @Get('/following/:userId')
  async getMyFollowing(@Param('userId') userId: string) {
    try {
      const following = await this.followService.getMyFollowing(userId);
      return {
        StatusCode: 200,
        Follower: following,
        FollowingCount: following.length,
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
}
