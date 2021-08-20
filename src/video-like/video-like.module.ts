import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';
import { VideoLike } from './entities/video-like.entity';
import { VideoLikeController } from './video-like.controller';
import { VideoLikeService } from './video-like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoLike]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Video]),
  ],
  providers: [VideoLikeService],
  controllers: [VideoLikeController],
  exports: [VideoLikeService],
})
export class VideoLikeModule {}
