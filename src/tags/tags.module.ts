import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/follow/entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { VideoLike } from 'src/video-like/entities/video-like.entity';
import { Video } from 'src/videos/entities/video.entity';
import { Tag } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Tag, User, VideoLike, Follow])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
