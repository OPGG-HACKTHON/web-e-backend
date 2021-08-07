import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Video } from './entities/video.entity';

@ApiTags('동영상(Video)')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiOperation({ summary: '동영상 생성' })
  @ApiOkResponse({ description: '생성 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateVideoDto })
  async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return await this.videosService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 동영상 검색' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  async findAll(): Promise<Video[]> {
    return this.videosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '동영상 검색' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  async findOne(@Param('id') id: number): Promise<Video> {
    return await this.videosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '동영상 수정' })
  @ApiOkResponse({ description: '수정 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<void> {
    return await this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '동영상 삭제' })
  @ApiOkResponse({ description: '삭제 완료' })
  @ApiUnauthorizedResponse({ description: '권한이 없음' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiNotFoundResponse({ description: '해당 동영상 없음' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.videosService.remove(+id);
  }
}
