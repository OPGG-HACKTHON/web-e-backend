import { Controller, Get, Query } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Hashtag } from './entities/hashtag.entity';

@ApiTags('해시태그(Hashtag)')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @ApiOperation({ summary: '해시태그 검색' })
  @ApiOkResponse({ description: '검색 완료' })
  @ApiBadRequestResponse({ description: '잘못된 입력' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '게임 카테고리',
  })
  async findAll(@Query() query): Promise<Hashtag[]> {
    return await this.hashtagService.findAll(query.category);
  }
}
