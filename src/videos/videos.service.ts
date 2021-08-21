import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
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
    video.videoName = createVideoDto.videoName;
    video.category = createVideoDto.category;
    video.src = location;
    if (createVideoDto.videoIntro) video.videoIntro = createVideoDto.videoIntro;
    return await this.videosRepository.save(video);
  }

  async findAll(
    loginUser: User,
    category?: string,
    hashtag?: string,
  ): Promise<Video[]> {
    let conditions = {};
    if (category) conditions['category'] = category;
    // if (hashtag) conditions['hashtag'] = hashtag;
    const videos = await this.videosRepository.find({
      relations: ['user'],
      where: conditions,
    });
    const followingInfos = await this.followRepository.find({
      userId: loginUser ? loginUser.userId : undefined,
    });
    const ret = videos.reduce((acc, it) => {
      const { user, ...rest } = it;
      acc.push({
        ...rest,
        poster: {
          name: user.userName,
          picture: user.userPhotoURL,
          followNum: 0, // Add later
        },
        relation: {
          isFollow: false, // Add later
          isLike: false, // Add later
        },
      });
      return acc;
    }, []);
    return ret;
  }

  async findOne(id: number): Promise<Video> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
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
}
