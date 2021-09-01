import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { VideosModule } from 'src/videos/videos.module';
import { Tag } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Tag]), VideosModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [],
})
export class TagsModule {}
