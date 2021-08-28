import {
  Body,
  Controller,
  HttpException,
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
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

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
}
