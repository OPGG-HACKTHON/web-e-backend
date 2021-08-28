import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
