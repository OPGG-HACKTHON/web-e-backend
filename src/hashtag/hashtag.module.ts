import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { VideoHashtag } from './entities/video-hashtag.entity';
import { Video } from 'src/videos/entities/video.entity';
import { HashtagVideoService } from './hashtag-video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hashtag]),
    TypeOrmModule.forFeature([VideoHashtag]),
    TypeOrmModule.forFeature([Video]),
  ],
  controllers: [HashtagController],
  providers: [HashtagService, HashtagVideoService],
  exports: [HashtagService, HashtagVideoService],
})
export class HashtagModule {}
