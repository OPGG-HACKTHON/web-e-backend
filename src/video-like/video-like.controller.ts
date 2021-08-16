import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
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
import { CreateVideoLikeDto } from './dto/create-video-like';
import { VideoLikeService } from './video-like.service';

@ApiTags('좋아요 기능(비디오)')
@Controller('videoLike')
export class VideoLikeController {
  constructor(private readonly videoLikeService: VideoLikeService) {}

  @ApiOperation({
    description: ':userId:가 (:likeId + :videoId) 로 좋아요를 진행한다.',
    summary: '비디오 좋아요 시작',
  })
  @ApiResponse({ status: 201, description: '비디오 좋아요 성공' })
  @ApiResponse({ status: 400, description: '입력데이터 오류' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @ApiResponse({ status: 405, description: '자신의 비디오 좋아요' })
  @ApiResponse({ status: 406, description: '이미 좋아요 한 비디오' })
  @ApiBody({
    type: CreateVideoLikeDto,
    description: '사용자ID(userId), Like할 Video Id(videoId)',
  })
  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/press')
  async create(@Body() likeData: CreateVideoLikeDto, @Req() req) {
    try {
      const like = this.videoLikeService.create(likeData, req.user);
      return like;
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

  @ApiOperation({
    description: '특정 유저 좋아요 리스트',
    summary: '좋아요 리스트',
  })
  @ApiResponse({ status: 200, description: '좋아요 목록' })
  @ApiResponse({ status: 404, description: '데이터정보 없음' })
  @Get(':userId/list')
  async getList(@Param('userId') userId: string) {
    try {
      const list = await this.videoLikeService.getList(userId);
      return {
        statusCode: 200,
        message: '좋아요 리스트',
        likeList: list,
        listCount: list.length,
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

  @ApiOperation({
    description: '특정 유저의 새로운 좋아요 리스트 목록',
    summary: '새로운 좋아요 리스트',
  })
  @ApiResponse({ status: 200, description: '새로운 좋아요 목록' })
  @ApiResponse({ status: 404, description: '데이터정보 없음' })
  @Get(':userId/newList')
  async getNewList(@Param('userId') userId: string) {
    try {
      const list = await this.videoLikeService.getNewList(userId);
      return {
        statusCode: 200,
        message: '새로운 좋아요 리스트',
        newLikeList: list,
        listCount: list.length,
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
    description: '좋아요 취소하기',
    summary: '좋아요 취소',
  })
  @ApiResponse({ status: 200, description: '좋아요 취소' })
  @ApiResponse({ status: 404, description: '좋아요 데이터 정보 없음' })
  @Delete()
  async dislike(@Req() req, @Body() likeData: CreateVideoLikeDto) {
    try {
      const dislike = await this.videoLikeService.dislike(req.user, likeData);
      return dislike;
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
