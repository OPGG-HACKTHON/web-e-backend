import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [UsersModule, AuthModule, VideosModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
