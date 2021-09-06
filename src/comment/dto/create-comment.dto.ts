import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/comment/entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, [
  'userId',
  'videoId',
  'content',
]) {}
