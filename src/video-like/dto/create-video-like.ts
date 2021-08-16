import { OmitType } from '@nestjs/swagger';
import { VideoLike } from '../entities/video-like.entity';

export class CreateVideoLikeDto extends OmitType(VideoLike, ['createdAt']) {}
