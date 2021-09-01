import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import { Video } from 'src/videos/entities/video.entity';
import { Repository } from 'typeorm';
import { Tag } from './entities/tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async createTag(videoId: number, tag: string) {
    const video = await this.videoRepository.findOne({
      id: videoId,
    });
    if (!video) throw new HttpException('비디오 정보가 없습니다', 404);
    return await this.tagRepository.save({
      videoId: videoId,
      tagName: tag,
    });
  }
  //select videoId from tag where tagName regexp 'string|string2|string3...';
  async getTags(tagData: string[]) {
    if (tagData.length === 0) {
      throw new HttpException('검색 데이터가 없습니다', 402);
    }
    if (isArray(tagData)) {
      const data = tagData.join('|');
      const video = await this.tagRepository
        .createQueryBuilder('t')
        .select('DISTINCT (t.videoId) AS videoId')
        .where('t.tagName REGEXP :tags', { tags: data })
        .getRawMany();
      return { data: video, data2: data };
    } else {
      const data = tagData;
      const video = await this.tagRepository
        .createQueryBuilder('t')
        .select('DISTINCT (t.videoId) AS videoId')
        .where('t.tagName REGEXP :tags', { tags: data })
        .getRawMany();
      return {
        statusCode: 200,
        message: '해시태그 검색 성공',
        datas: video,
        searchData: data,
      };
    }
  }
}
