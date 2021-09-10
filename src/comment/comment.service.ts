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
      throw new HttpException(
        {
          statusCode: 404,
          message: '좋아요 받는 비디오 정보 없음',
          error: 'VIDEO-001',
          data: commentData,
        },
        404,
      );
    }
    const user = await this.userRepository.findOne({
      userId: commentData.userId,
    });
    const comment = await this.commentRepository.findOne(commentData);
    if (comment) {
      throw new HttpException(
        {
          statusCode: 409,
          message: '이미 입력한 댓글',
          error: 'COMMENT-001',
          data: commentData,
        },
        409,
      );
    }
    if (commentData.content === undefined) {
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Comment 내용 없음',
          error: 'INPUT-007',
          data: commentData,
        },
        400,
      );
    }
    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보 없음',
          error: 'USER-001',
          data: commentData,
        },
        404,
      );
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
        {
          statusCode: 400,
          message: '비디오 아이디 없음',
          error: 'INPUT-004',
          data: videoId,
        },
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
