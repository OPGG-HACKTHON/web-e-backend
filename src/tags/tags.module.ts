import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { Tag } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Tag])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [],
})
export class TagsModule {}
