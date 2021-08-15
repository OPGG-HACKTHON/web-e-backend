import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLike } from './entities/video-like.entity';
import { VideoLikeController } from './video-like.controller';
import { VideoLikeService } from './video-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoLike])],
  providers: [VideoLikeService],
  controllers: [VideoLikeController],
  exports: [VideoLikeService],
})
export class VideoLikeModule {}
