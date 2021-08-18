import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { Repository } from 'typeorm';
import { VideoHashtag } from './entities/video-hashtag.entity';

@Injectable()
export class HashtagVideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(VideoHashtag)
    private readonly videoHashtagRepository: Repository<VideoHashtag>,
  ) {}

  async create(id: number, hashtag: string): Promise<void> {
    const video = await this.videoRepository.findOneOrFail(id);
    const videoHashtag = await this.videoHashtagRepository.create();
    videoHashtag.videoId = id;
    videoHashtag.hashtag = hashtag;
    videoHashtag.video = video;
    video.hashtags.push(videoHashtag);
    await this.videoRepository.save(video);
    await this.videoHashtagRepository.save(videoHashtag);
  }

  async remove(id: number, hashtag: string): Promise<void> {
    const video = await this.videoRepository.findOneOrFail(id);
    const videoHashtagToDelete = await this.videoHashtagRepository.find({
      videoId: id,
      hashtag: hashtag,
    });
    const index = video.hashtags.findIndex(
      (e) => e.videoId === id && e.hashtag === hashtag,
    );
    delete video.hashtags[index];
    await this.videoRepository.save(video);
    await this.videoHashtagRepository.delete({
      videoId: id,
      hashtag: hashtag,
    });
  }
}
