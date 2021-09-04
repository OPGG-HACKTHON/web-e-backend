import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoLikeDto } from './dto/create-video-like';
import { VideoLike } from './entities/video-like.entity';

@Injectable()
export class VideoLikeService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,
  ) {}
  //create videoLike Logic
  async create(likeData: CreateVideoLikeDto, loginUser: any) {
    const user = await this.usersRepository.findOne({
      userId: likeData.userId,
    });
    const likeUser = await this.usersRepository.findOne({
      userId: likeData.likeId,
    });
    const likeVideo = await this.videosRepository.findOne({
      id: likeData.videoId,
      user: likeUser,
    });
    const already = await this.videoLikeRepository.findOne({
      userId: likeData.userId,
      likeId: likeData.likeId,
      videoId: likeData.videoId,
    });
    //input validation
    if (!user)
      throw new HttpException('좋아요 하는 유저 아이디 정보가 없습니다', 404);
    if (!likeUser)
      throw new HttpException('좋아요 받는 유저 아이디 정보가 없습니다', 404);
    if (!likeVideo)
      throw new HttpException('좋아요 받는 비디오 정보가 없습니다', 404);
    if (already) throw new HttpException('이미 좋아요 상태입니다.', 406);
    //login data and user validation
    if (user.userId === likeUser.userId)
      throw new HttpException('내 동영상을 좋아요 할 수 없습니다.', 405);
    if (likeData.userId !== loginUser.id)
      throw new HttpException('권한이 없습니다(로그인 정보 불일치)', 405);
    await this.videoLikeRepository.save(likeData);
    likeVideo.likes += 1;
    await this.videosRepository.save(likeVideo);
    return {
      statusCode: 201,
      message: '비디오 좋아요 성공',
      data: likeData,
    };
  }

  async dislike(loginUser: any, likeData: CreateVideoLikeDto) {
    const like = await this.isLike(likeData);
    const likeUser = await this.usersRepository.findOne({
      userId: likeData.likeId,
    });
    const video = await this.videosRepository.findOne({
      id: likeData.videoId,
      user: likeUser,
    });
    if (!likeUser)
      throw new HttpException('좋아요 받는 유저 아이디 정보가 없습니다', 404);
    if (!video) throw new HttpException('좋아요한 비디오 정보가 없습니다', 404);
    if (!like) throw new HttpException('좋아요 정보가 없습니다', 404);
    if (loginUser.id !== likeData.userId)
      throw new HttpException('권한이 없습니다(로그인 정보 불일치)', 401);
    else {
      await this.videoLikeRepository.delete({
        userId: likeData.userId,
        likeId: likeData.likeId,
        videoId: likeData.videoId,
      });
      video.likes -= 1;
      await this.videosRepository.save(video);
      return { statusCode: 200, message: '좋아요 취소', data: likeData };
    }
  }

  //check this videolike data is valid
  async isLike(likeData: CreateVideoLikeDto): Promise<boolean> {
    const like = await this.videoLikeRepository.findOne({
      userId: likeData.userId,
      likeId: likeData.likeId,
      videoId: likeData.videoId,
    });
    if (like) return true;
    else return false;
  }
  //get like list
  async getList(userId: string) {
    const validUser = await this.usersRepository.findOne({ userId: userId });
    if (!validUser) throw new HttpException('사용자가 없습니다', 404);
    //like list Logic
    const likeList = await this.videoLikeRepository
      .createQueryBuilder('vl')
      .innerJoin(User, 'u', 'vl.userId = u.userId')
      .innerJoin(Video, 'v', 'v.id = vl.videoId')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'v.videoName AS videoName',
        'v.videoIntro AS videoIntro',
        'v.category AS category',
        'vl.createdAt AS createdAt',
      ])
      .where('vl.likeId = :userId', { userId: userId })
      .orderBy('vl.createdAt', 'DESC')
      .getRawMany();
    return likeList;
  }
  //get new video Like list
  async getNewList(userId: string) {
    const validUser = await this.usersRepository.findOne({ userId: userId });
    if (!validUser) throw new HttpException('사용자가 없습니다', 404);
    //new like list Logic
    const likeList = await this.videoLikeRepository
      .createQueryBuilder('vl')
      .innerJoin(User, 'u', 'vl.userId = u.userId')
      .innerJoin(Video, 'v', 'v.id = vl.videoId')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'v.videoName AS videoName',
        'v.videoIntro AS videoIntro',
        'v.category AS category',
        'vl.createdAt AS createdAt',
      ])
      .where('vl.likeId = :userId AND :loginAt <= vl.createdAt', {
        userId: userId,
        loginAt: validUser.loginAt,
      })
      .orderBy('vl.createdAt', 'DESC')
      .getRawMany();
    return likeList;
  }
}
