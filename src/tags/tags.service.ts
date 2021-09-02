import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import { Follow } from 'src/follow/entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { VideoLike } from 'src/video-like/entities/video-like.entity';
import { Video } from 'src/videos/entities/video.entity';
import { In, Repository } from 'typeorm';
import { Tag } from './entities/tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,
  ) {}
  async createTag(videoId: number, tag: string) {
    const video = await this.videosRepository.findOne({
      id: videoId,
    });
    if (!video) throw new HttpException('비디오 정보가 없습니다', 404);
    return await this.tagRepository.save({
      videoId: videoId,
      tagName: tag,
    });
  }
  //select videoId from tag where tagName regexp 'string|string2|string3...';
  async getTags(tagData: string[], userId: string) {
    if (tagData.length === 0) {
      throw new HttpException('검색 데이터가 없습니다', 202);
    }
    if (isArray(tagData)) {
      const data = tagData.join('|');
      const video = await this.tagRepository
        .createQueryBuilder('t')
        .select('DISTINCT (t.videoId) AS videoId')
        .where('t.tagName REGEXP :tags', { tags: data })
        .getRawMany();
      const videoArray = video.map(({ videoId }) => videoId);
      const searchDatas = await this.searchDetail(videoArray, userId);
      return {
        statusCode: 200,
        message: '해시태그 검색 성공',
        datas: searchDatas,
        searchData: data,
      };
    } else {
      const data = tagData;
      const video = await this.tagRepository
        .createQueryBuilder('t')
        .select('DISTINCT (t.videoId) AS videoId')
        .where('t.tagName REGEXP :tags', { tags: data })
        .getRawMany();
      const videoArray = video.map(({ videoId }) => videoId);
      const searchDatas = await this.searchDetail(videoArray, userId);
      return {
        statusCode: 200,
        message: '해시태그 검색 성공',
        datas: searchDatas,
        searchData: data,
      };
    }
  }
  // 조건 붙여야함 user
  async searchDetail(videoIds: number[], userId: string) {
    const videos = await this.videosRepository.find({
      id: In(videoIds),
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const isFollow = await this.isFollow(userId, video.userId);
        const isLike = await this.isLike(userId, video.userId, video.id);
        const users = await this.usersRepository.findOne(video.userId);
        if (!users) throw new HttpException('사용자 정보가 없습니다', 404);
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
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
