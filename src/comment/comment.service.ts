import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Video } from 'src/videos/entities/video.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createComment(commentData: CreateCommentDto) {
    const video = await this.videoRepository.findOne({
      id: commentData.videoId,
    });
    if (!video) {
      throw new HttpException('비디오 정보가 없습니다', 405);
    }
    const user = await this.userRepository.findOne({
      userId: commentData.userId,
    });
    const comment = await this.commentRepository.findOne(commentData);
    if (comment) {
      throw new HttpException('이미 입력한 댓글입니다', 408);
    }
    if (commentData.content === undefined) {
      throw new HttpException('댓글 내용을 작성해야 합니다', 400);
    }
    if (!user) {
      throw new HttpException('유저 정보가 없습니다', 406);
    }
    await this.commentRepository.save({
      userId: commentData.userId,
      videoId: commentData.videoId,
      content: commentData.content,
    });
    video.comments = video.comments + 1;
    await this.videoRepository.save(video);
  }
}
