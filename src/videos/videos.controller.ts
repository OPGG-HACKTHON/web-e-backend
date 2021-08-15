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
  Request,
  UsePipes,
  ValidationPipe,
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
    const video = await this.videosService.create(
      createVideoDto,
      file.location,
    );
    return video;
  }

  @Get()
  @ApiOperation({ summary: '동영상 리스트' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '게임 카테고리',
  })
  @ApiQuery({
    name: 'hashtag',
    required: false,
    description: '해시태그',
  })
  async findAll(@Request() req, @Query() query?): Promise<Video[]> {
    return await this.videosService.findAll(
      req.user, // How can I get login user data?
      query.category,
      query.hashtag,
    );
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

  /* Modify later
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
    }),
  )
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
        bucket: config().awsS3BucketName,
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
    @UploadedFile() file?,
  ): Promise<void> {
    console.log(updateVideoDto);
    console.log(file);
    return await this.videosService.update(
      id,
      updateVideoDto,
      file ? file.location : undefined,
    );
  }
  */

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
