import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), AuthModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService]
})
export class VideosModule {}
