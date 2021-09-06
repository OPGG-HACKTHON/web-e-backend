import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Video } from 'src/videos/entities/video.entity';
import { User } from 'src/users/entities/user.entity';
import { isNumber } from 'class-validator';

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

  async getComment(videoId: number) {
    if (videoId === undefined || !isNumber(videoId)) {
      throw new HttpException(
        '찾으려는 데이터를 입력하거나, videoId를 입력해 주세요',
        400,
      );
    }
    const commentList = await this.commentRepository
      .createQueryBuilder('c')
      .innerJoin(User, 'u', 'c.userId = u.userId')
      .select([
        'c.videoId AS videoId',
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'c.content AS content',
      ])
      .where('c.videoId = :id', { id: videoId })
      .getRawMany();
    return commentList;
  }
}
