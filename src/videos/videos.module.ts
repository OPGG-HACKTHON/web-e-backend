import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Video } from './entities/video.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideoLike } from 'src/video-like/entities/video-like.entity';
import { Tag } from 'src/tags/entities/tags.entity';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Video]),
    TypeOrmModule.forFeature([Follow]),
    TypeOrmModule.forFeature([VideoLike]),
    TypeOrmModule.forFeature([Tag]),
    AuthModule,
    TagsModule,
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
