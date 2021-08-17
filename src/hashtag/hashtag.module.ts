import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { VideoHashtag } from './entities/video-hashtag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hashtag]),
    TypeOrmModule.forFeature([VideoHashtag]),
  ],
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
