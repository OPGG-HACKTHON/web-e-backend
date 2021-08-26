import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { VideoLike } from 'src/video-like/entities/video-like.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    location: string,
  ): Promise<Video> {
    const video = this.videosRepository.create();
    const videoUserId = createVideoDto.userId;
    const user = await this.usersRepository.findOne(videoUserId);
    if (!user)
      throw new HttpException(`User with id ${videoUserId} is none.`, 404);
    video.user = user;
    video.userId = videoUserId;
    video.videoName = createVideoDto.videoName;
    video.category = createVideoDto.category;
    video.src = location;
    if (createVideoDto.videoIntro) video.videoIntro = createVideoDto.videoIntro;
    return await this.videosRepository.save(video);
  }

  async findAll(start: number, end: number) {
    const videos = await this.videosRepository.find({
      id: Between(start, end),
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const users = await this.usersRepository.findOne(video.userId);
        return Object.assign(video, {
          relation: { isFollow: false, isLike: false },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findAllOnUser(loginData: any, start: number, end: number) {
    const loginUser = await this.usersRepository.findOne(loginData.id);
    if (loginUser.userId !== loginData.id)
      throw new HttpException('권한이 없습니다(로그인 정보 불일치)', 401);
    const videos = await this.videosRepository.find({
      id: Between(start, end),
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users) throw new HttpException('사용자 정보가 없습니다', 404);
        return Object.assign(video, {
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findOne(id: number): Promise<Video> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    return video;
  }

  async findUserVideos(userId: string): Promise<Video[]> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) throw new HttpException('사용자 정보가 없습니다', 404);
    const video = await this.videosRepository.find({
      where: { user: user },
    });
    return video;
  }

  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
    location?: string,
  ): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const videoToUpdate = await this.videosRepository.findOne(id);
    if (!videoToUpdate)
      throw new HttpException(`Video with id ${id} is none.`, 404);
    if (videoToUpdate.videoName)
      videoToUpdate.videoName = updateVideoDto.videoName;
    if (videoToUpdate.category)
      videoToUpdate.category = updateVideoDto.category;
    if (updateVideoDto.videoIntro)
      videoToUpdate.videoIntro = updateVideoDto.videoIntro;
    if (location) videoToUpdate.src = location;
    await this.videosRepository.save(videoToUpdate);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    await this.videosRepository.delete(id);
  }

  async increaseViews(id: number): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const videoToUpdate = await this.videosRepository.findOne(id);
    if (!videoToUpdate)
      throw new HttpException(`Video with id ${id} is none.`, 404);
    videoToUpdate.views++;
    await this.videosRepository.save(videoToUpdate);
  }

  async isFollow(userId: string, followingId: string) {
    const validFollow = await this.followRepository.findOne({
      userId: userId,
      followingId: followingId,
    });
    if (validFollow) return true;
    else return false;
  }

  //check this videolike data is valid
  async isLike(
    userId: string,
    likeId: string,
    videoId: number,
  ): Promise<boolean> {
    const like = await this.videoLikeRepository.findOne({
      userId: userId,
      likeId: likeId,
      videoId: videoId,
    });
    if (like) return true;
    else return false;
  }
}
