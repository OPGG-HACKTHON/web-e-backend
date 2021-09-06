import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Video } from './videos/entities/video.entity';
import { Follow } from './follow/entities/follow.entity';
import { Comment } from './comment/entities/comment.entity';
import { VideosModule } from './videos/videos.module';
import { ImageModule } from './image/image.module';
import { FollowModule } from './follow/follow.module';
import { VideoLikeModule } from './video-like/video-like.module';
import { VideoLike } from './video-like/entities/video-like.entity';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/entities/tags.entity';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // configuration 설정을 coifg module 불러 올 때 로드한다
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [User, Video, Follow, VideoLike, Tag, Comment],
        synchronize: false,
      }),
    }),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([User]), //users.module.ts에 있는걸 app.module.ts에도 동일하게 넣어준 모습
    VideosModule,
    ImageModule,
    FollowModule,
    VideoLikeModule,
    TagsModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
