import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userRole } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/users/entities/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('해시태그 (Tags)')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    description: 'Tag Insert Operation',
    summary: '태그 삽입',
  })
  @ApiResponse({ status: 201, description: '태그 입력 성공' })
  @ApiResponse({ status: 400, description: '태그 정보 없음' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '비디오 정보 없음' })
  @ApiBody({
    type: CreateTagDto,
    description: '비디오 ID(videoId), 태그명 tags string[]',
  })
  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async create(@Body() tagData: CreateTagDto) {
    if (tagData.tags.length > 0) {
      return Promise.all(
        tagData.tags.map(async (tag) => {
          await this.tagsService.createTag(tagData.videoId, tag);
        }),
      )
        .then(() => {
          return {
            statusCode: 201,
            message: '태그 삽입 성공',
            datas: tagData,
          };
        })
        .catch((err) => {
          throw new HttpException(
            {
              statusCode: err.status,
              message: err.message,
              data: tagData,
            },
            err.status,
          );
        });
    } else {
      throw new HttpException(
        {
          statusCode: 400,
          message: '태그 정보 없음',
          data: tagData,
        },
        400,
      );
    }
  }

  @ApiOperation({
    description: 'Tag Search Operation',
    summary: '태그 검색',
  })
  @ApiResponse({ status: 200, description: '태그 검색 성공' })
  @ApiResponse({ status: 400, description: '태그 정보 없음' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '비디오 정보 없음' })
  @ApiQuery({
    name: 'hashtags',
    description: '해시태그 검색 목록',
    required: false,
  })
  @ApiBearerAuth('access-token')
  @Get('/search')
  async getTags(@Query() query, @Req() req) {
    try {
      if (!Object.keys(query).includes('hashtags')) {
        throw new HttpException(
          '검색 결과가 없습니다. [not have value in Query(hashtags)]',
          400,
        );
      }
      if (req.headers.authorization !== undefined) {
        const tagArray = query.hashtags.split('+');
        try {
          const token = jwt_decode(req.headers.authorization);
          const data = await this.tagsService.getTags(
            tagArray,
            token['userId'],
          );
          return data;
        } catch (err) {
          throw new HttpException('Invalid Token', 406);
        }
      } else {
        const tagArray = query.hashtags.split('+');
        try {
          const data = await this.tagsService.getTags(
            tagArray,
            'asdfghlkasdjkasdjlkajsdlkjasldj',
          );
          return data;
        } catch (err) {
          throw new HttpException('Invalid Token', 406);
        }
      }
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
