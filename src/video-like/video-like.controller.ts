import { Controller, Post } from '@nestjs/common';
import { VideoLikeService } from './video-like.service';

@Controller('video-like')
export class VideoLikeController {
  constructor(private readonly videoLikeService: VideoLikeService) {}
}
