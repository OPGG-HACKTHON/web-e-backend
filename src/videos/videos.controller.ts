import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Req,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Video } from './entities/video.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import config from 'src/config/configuration';
import { userRole } from 'src/auth/role.decorator';
import { Role } from 'src/users/entities/user.entity';
import { RoleGuard } from 'src/auth/role.guard';

const s3 = new AWS.S3({
  accessKeyId: config().awsAccessKeyId,
  secretAccessKey: config().awsSecretAccessKey,
  region: config().awsS3Region,
});

@ApiTags('동영상(Video)')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiOperation({ summary: '동영상 업로드' })
  @ApiResponse({
    status: 201,
    description: '업로드 완료',
  })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateVideoDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: multerS3({
        s3: s3,
        bucket: `${config().awsS3BucketName}/videos`,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          cb(null, Date.now().toString());
        },
      }),
    }),
  )
  async create(@Body() createVideoDto: CreateVideoDto, @UploadedFile() file) {
    try {
      const video = await this.videosService.create(
        createVideoDto,
        file.location,
      );
      return {
        statusCode: 201,
        message: '비디오 업로드& 정보 등록 완료',
        datas: video,
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

  @Get('/all/onLogin')
  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '로그인 시 동영상 리스트' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiResponse({ status: 404, description: '사용자 정보 오류' })
  @ApiQuery({
    name: 'end',
    description: '끝번호',
  })
  @ApiQuery({
    name: 'start',
    description: '시작번호',
  })
  async findAllOnUser(@Req() req, @Query() query) {
    try {
      const videoList = await this.videosService.findAllOnUser(
        req.user,
        query.start,
        query.end,
      );
      return {
        statusCode: 200,
        message: '비디오 리스트',
        datas: videoList,
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

  @Get('/all')
  @ApiOperation({ summary: '비 로그인 시 동영상 리스트' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiQuery({
    name: 'end',
    description: '끝번호',
  })
  @ApiQuery({
    name: 'start',
    description: '시작번호',
  })
  async findAll(@Query() query) {
    try {
      const videoList = await this.videosService.findAll(
        query.start,
        query.end,
      );
      return {
        statusCode: 200,
        message: '비디오 리스트',
        datas: videoList,
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

  @Get('/all/middle')
  @ApiOperation({ summary: '비 로그인 시 동영상 리스트' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  async findAllMiddle() {
    try {
      const videoList = await this.videosService.findAll(1, 200);
      return {
        statusCode: 200,
        message: '비디오 리스트',
        datas: videoList,
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

  @Get(':id')
  @ApiOperation({ summary: '동영상 검색' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  async findOne(@Param('id') id: number): Promise<Video> {
    await this.videosService.increaseViews(id);
    return await this.videosService.findOne(id);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: '특정 사용자 동영상들 검색' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  @ApiResponse({ status: 404, description: '사용자 정보 없음' })
  async findUserVideos(@Param('userId') userId: string) {
    try {
      const videoList = await this.videosService.findUserVideos(userId);
      return {
        statusCode: 200,
        message: '비디오 리스트',
        datas: videoList,
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

  @Patch(':id')
  @ApiOperation({ summary: '동영상 수정' })
  @ApiOkResponse({ description: '수정 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateVideoDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: multerS3({
        s3: s3,
        bucket: `${config().awsS3BucketName}/videos`,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          cb(null, Date.now().toString());
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile() file,
  ): Promise<void> {
    return await this.videosService.update(id, updateVideoDto, file.location);
  }

  @Delete(':id')
  @ApiOperation({ summary: '동영상 삭제' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.videosService.remove(id);
  }
}
